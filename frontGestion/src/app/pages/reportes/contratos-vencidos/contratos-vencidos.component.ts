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
  selector: 'app-contratos-vencidos',
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
  templateUrl: './contratos-vencidos.component.html',
  styleUrl: './contratos-vencidos.component.css'
})
export class ContratosVencidosComponent implements OnInit {
  contratosVencidos: any[] = [];
  cargando = true;
  totalContratos = 0;
  today = new Date();

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarContratosVencidos();
  }

  cargarContratosVencidos(): void {
    this.cargando = true;
    this.reporteService.getContratosVencidos().subscribe({
      next: (contratos) => {
        this.contratosVencidos = contratos;
        this.totalContratos = contratos.length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar contratos vencidos', err);
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

  // Método para calcular días de vencimiento
  getDiasVencido(fechaFin: string): number {
    const fecha = new Date(fechaFin);
    const hoy = new Date();
    const diffTime = Math.abs(hoy.getTime() - fecha.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Métodos para el template (evitar expresiones complejas en HTML)
  getContratosVencidosMasDe30Dias(): number {
    return this.contratosVencidos.filter(c => this.getDiasVencido(c.fechaFin) > 30).length;
  }

  getContratosVencidosMenosOIgual30Dias(): number {
    return this.contratosVencidos.filter(c => this.getDiasVencido(c.fechaFin) <= 30).length;
  }

  getTotalClientesAfectados(): number {
    const ids = this.contratosVencidos.map(c => c.clienteId);
    return Array.from(new Set(ids)).length;
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarContratosVencidos();
  }
}
