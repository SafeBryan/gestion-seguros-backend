import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contrato } from '../../../models/contrato.model';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material imports
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.css'],
  imports: [
    CommonModule, 
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule
  ],
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'seguro', 'fechaInicio', 'fechaFin', 'estado', 'acciones'];

  @Output() editar = new EventEmitter<Contrato>(); 

  constructor(
    private contratoService: ContratoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.loading = true;
    this.contratoService
      .obtenerPorCliente(this.authService.getUsuarioId())
      .subscribe({
        next: (data) => {
          this.contratos = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar contratos', err);
          this.snackBar.open('Error al cargar los contratos', 'Cerrar', { duration: 3000 });
          this.loading = false;
        },
      });
  }

  desactivarContrato(contrato: Contrato): void {
    if (!contrato?.id) return;
    
    // Confirmación antes de desactivar
    const confirmar = confirm(`¿Está seguro que desea cancelar el contrato #${contrato.id}?`);
    if (!confirmar) return;
    
    this.loading = true;
    this.contratoService.actualizarEstado(contrato.id, 'CANCELADO').subscribe({
      next: () => {
        this.snackBar.open('Contrato cancelado exitosamente', 'Cerrar', { duration: 3000 });
        this.cargarContratos();
      },
      error: (err) => {
        console.error('Error al desactivar contrato', err);
        this.snackBar.open('Error al cancelar el contrato', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  editarContrato(contrato: Contrato): void {
    this.editar.emit({...contrato});
  }
  
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'primary';
      case 'PENDIENTE':
        return 'accent';
      case 'CANCELADO':
        return 'warn';
      default:
        return '';
    }
  }
  
  getFrecuenciaPagoTexto(frecuencia: string): string {
    switch (frecuencia) {
      case 'MENSUAL':
        return 'Mensual';
      case 'TRIMESTRAL':
        return 'Trimestral';
      case 'SEMESTRAL':
        return 'Semestral';
      case 'ANUAL':
        return 'Anual';
      default:
        return frecuencia;
    }
  }
  
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}