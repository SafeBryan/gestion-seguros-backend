import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../core/services/reporte.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-reembolsos-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './reembolsos-pendientes.component.html',
  styleUrl: './reembolsos-pendientes.component.css'
})
export class ReembolsosPendientesComponent implements OnInit {
  reembolsosPendientes: any[] = [];
  cargando = true;
  totalReembolsos = 0;
  totalMonto = 0;
  today = new Date();

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarReembolsosPendientes();
  }

  cargarReembolsosPendientes(): void {
    this.cargando = true;
    this.reporteService.getReembolsosPendientes().subscribe({
      next: (reembolsos) => {
        this.reembolsosPendientes = reembolsos;
        this.totalReembolsos = reembolsos.length;
        this.totalMonto = reembolsos.reduce((sum, reembolso) => sum + reembolso.monto, 0);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reembolsos pendientes', err);
        this.cargando = false;
      }
    });
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Método para formatear precio
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Método para obtener el estado del reembolso
  getEstadoReembolso(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
      case 'PAGADO': return 'Pagado';
      default: return estado;
    }
  }

  // Método para obtener el color del estado
  getColorEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'warning';
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'danger';
      case 'PAGADO': return 'info';
      default: return 'primary';
    }
  }

  // Método para calcular días transcurridos
  getDiasTranscurridos(fechaSolicitud: string): number {
    const fecha = new Date(fechaSolicitud);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - fecha.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getTotalClientesAfectados(): number {
    const ids = this.reembolsosPendientes.map(r => r.clienteId);
    return Array.from(new Set(ids)).length;
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarReembolsosPendientes();
  }
}
