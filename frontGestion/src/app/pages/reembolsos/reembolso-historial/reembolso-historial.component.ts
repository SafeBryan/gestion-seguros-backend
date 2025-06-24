import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { AuthService } from '../../../services/auth.service';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reembolso-historial',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './reembolso-historial.component.html',
  styleUrls: ['./reembolso-historial.component.css'],
})
export class ReembolsoHistorialComponent implements OnInit {
  reembolsos: ReembolsoResponse[] = [];
  filteredReembolsos: ReembolsoResponse[] = [];
  cargando = true;
  searchTerm = '';

  constructor(
    private reembolsoService: ReembolsoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarReembolsos();
  }

  cargarReembolsos(): void {
    this.cargando = true;
    const clienteId = this.authService.getUsuarioId();
    
    this.reembolsoService.obtenerPorCliente(clienteId).subscribe({
      next: (data) => {
        this.reembolsos = data;
        this.filteredReembolsos = [...data];
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error al cargar reembolsos:', error);
        this.mostrarNotificacion('Error al cargar los reembolsos', 'error');
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    
    if (this.searchTerm === '') {
      this.filteredReembolsos = [...this.reembolsos];
    } else {
      this.filteredReembolsos = this.reembolsos.filter(reembolso =>
        reembolso.descripcion.toLowerCase().includes(this.searchTerm) ||
        reembolso.estado.toLowerCase().includes(this.searchTerm) ||
        reembolso.monto.toString().includes(this.searchTerm) ||
        reembolso.contratoId.toString().includes(this.searchTerm)
      );
    }
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.filteredReembolsos = [...this.reembolsos];
    // Limpiar el input también
    const input = document.querySelector('.search-filter input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  trackByReembolsoId(index: number, reembolso: ReembolsoResponse): number {
    return reembolso.id;
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'APROBADO':
        return 'estado-aprobado';
      case 'RECHAZADO':
        return 'estado-rechazado';
      default:
        return 'estado-default';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado?.toUpperCase()) {
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

  verDetalles(reembolso: ReembolsoResponse): void {
    // Implementar lógica para mostrar detalles del reembolso
    console.log('Ver detalles de reembolso:', reembolso);
    this.mostrarNotificacion('Esta funcionalidad estará disponible pronto', 'info');
  }

  verArchivos(reembolso: ReembolsoResponse): void {
    // Implementar lógica para mostrar archivos adjuntos
    console.log('Ver archivos de reembolso:', reembolso);
    this.mostrarNotificacion('Esta funcionalidad estará disponible pronto', 'info');
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : 
                 tipo === 'success' ? ['success-snackbar'] : ['info-snackbar'],
    });
  }

  // Método helper para contar archivos
  getArchivosCount(archivos: { [nombre: string]: string } | undefined): number {
    if (!archivos) return 0;
    return Object.keys(archivos).length;
  }
}