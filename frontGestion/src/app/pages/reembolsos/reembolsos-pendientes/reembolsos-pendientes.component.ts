import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';
import { ReembolsoDetalleDialogComponent } from '../reembolso-detalle-dialog/reembolso-detalle-dialog.component';

// Angular Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reembolsos-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './reembolsos-pendientes.component.html',
  styleUrls: ['./reembolsos-pendientes.component.css'],
})
export class ReembolsosPendientesComponent implements OnInit, AfterViewInit {
  // Propiedades de datos
  reembolsos: ReembolsoResponse[] = [];
  dataSource = new MatTableDataSource<ReembolsoResponse>([]);
  displayedColumns: string[] = [
    'cliente',
    'contrato',
    'seguro',
    'monto',
    'estado',
    'fecha',
    'acciones',
  ];

  // Estado UI
  loading = true;

  // Referencias a elementos del DOM
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reembolsoService: ReembolsoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarReembolsos();
  }

  ngAfterViewInit() {
    // Configurar paginador y ordenamiento después de que las vistas se inicialicen
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  cargarReembolsos(): void {
    this.loading = true;
    this.reembolsoService.obtenerPendientes().subscribe({
      next: (data) => {
        this.reembolsos = data;
        this.dataSource = new MatTableDataSource<ReembolsoResponse>(this.reembolsos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reembolsos pendientes', err);
        this.loading = false;
        this.mostrarNotificacion('Error al cargar reembolsos pendientes', 'error');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirDetalle(reembolso: ReembolsoResponse): void {
    const dialogRef = this.dialog.open(ReembolsoDetalleDialogComponent, {
      width: '600px',
      data: reembolso,
    });

    dialogRef.afterClosed().subscribe((accion) => {
      if (accion?.realizado) {
        this.reembolsos = this.reembolsos.filter((r) => r.id !== reembolso.id);
        this.dataSource.data = this.reembolsos;
        this.mostrarNotificacion(`Reembolso ${accion.tipo}`, 'success');
      }
    });
  }

  aprobarReembolso(reembolso: ReembolsoResponse): void {
    const dialogRef = this.dialog.open(ReembolsoDetalleDialogComponent, {
      width: '600px',
      data: { ...reembolso, accionDirecta: 'aprobar' },
    });

    dialogRef.afterClosed().subscribe((accion) => {
      if (accion?.realizado) {
        this.reembolsos = this.reembolsos.filter((r) => r.id !== reembolso.id);
        this.dataSource.data = this.reembolsos;
        this.mostrarNotificacion('Reembolso aprobado correctamente', 'success');
      }
    });
  }

  rechazarReembolso(reembolso: ReembolsoResponse): void {
    const dialogRef = this.dialog.open(ReembolsoDetalleDialogComponent, {
      width: '600px',
      data: { ...reembolso, accionDirecta: 'rechazar' },
    });

    dialogRef.afterClosed().subscribe((accion) => {
      if (accion?.realizado) {
        this.reembolsos = this.reembolsos.filter((r) => r.id !== reembolso.id);
        this.dataSource.data = this.reembolsos;
        this.mostrarNotificacion('Reembolso rechazado', 'success');
      }
    });
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' {
    switch (estado) {
      case 'PENDIENTE':
        return 'accent';
      case 'APROBADO':
        return 'primary';
      case 'RECHAZADO':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'schedule';
      case 'APROBADO':
        return 'check_circle';
      case 'RECHAZADO':
        return 'cancel';
      default:
        return 'help';
    }
  }

  formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByReembolsoId(index: number, reembolso: ReembolsoResponse): number {
    return reembolso.id;
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar'],
    });
  }
}