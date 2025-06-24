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
  selector: 'app-seguros-impagos',
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
  templateUrl: './seguros-impagos.component.html',
  styleUrl: './seguros-impagos.component.css'
})
export class SegurosImpagosComponent implements OnInit {
  segurosImpagos: any[] = [];
  cargando = true;
  totalSeguros = 0;
  today = new Date();

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarSegurosImpagos();
  }

  cargarSegurosImpagos(): void {
    this.cargando = true;
    this.reporteService.getSegurosImpagos().subscribe({
      next: (seguros) => {
        this.segurosImpagos = seguros;
        this.totalSeguros = seguros.length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros impagos', err);
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

  // Método para obtener el estado del contrato
  getEstadoContrato(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'Activo';
      case 'INACTIVO': return 'Inactivo';
      case 'VENCIDO': return 'Vencido';
      case 'PENDIENTE': return 'Pendiente';
      default: return estado;
    }
  }

  // Método para obtener el color del estado
  getColorEstado(estado: string): string {
    switch (estado) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'secondary';
      case 'VENCIDO': return 'warn';
      case 'PENDIENTE': return 'accent';
      default: return 'primary';
    }
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarSegurosImpagos();
  }

  // Método para contar contratos activos
  getContratosActivos(): number {
    return this.segurosImpagos.filter(s => s.estado === 'ACTIVO').length;
  }

  // Método para contar clientes únicos
  getTotalClientesAfectados(): number {
    const ids = this.segurosImpagos.map(s => s.clienteId);
    return Array.from(new Set(ids)).length;
  }
}
