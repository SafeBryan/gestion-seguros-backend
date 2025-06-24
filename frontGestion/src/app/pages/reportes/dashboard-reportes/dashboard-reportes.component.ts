import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-dashboard-reportes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './dashboard-reportes.component.html',
  styleUrl: './dashboard-reportes.component.css'
})
export class DashboardReportesComponent implements OnInit {
  // Contadores para las estadísticas
  totalSegurosImpagos = 0;
  totalReembolsosPendientes = 0;
  totalContratosVencidos = 0;
  totalContratosPorVencer = 0;
  totalContratosPorCliente = 0;

  // Listas para mostrar los últimos registros
  ultimosSegurosImpagos: any[] = [];
  ultimosReembolsosPendientes: any[] = [];
  ultimosContratosVencidos: any[] = [];
  ultimosContratosPorVencer: any[] = [];

  // Control de carga
  cargandoSegurosImpagos = true;
  cargandoReembolsosPendientes = true;
  cargandoContratosVencidos = true;
  cargandoContratosPorVencer = true;

  // Fecha actual para mostrar en el dashboard
  today = new Date();

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargarDatosSegurosImpagos();
    this.cargarDatosReembolsosPendientes();
    this.cargarDatosContratosVencidos();
    this.cargarDatosContratosPorVencer();
  }

  cargarDatosSegurosImpagos(): void {
    this.cargandoSegurosImpagos = true;
    this.reporteService.getSegurosImpagos().subscribe({
      next: (seguros) => {
        this.totalSegurosImpagos = seguros.length;
        this.ultimosSegurosImpagos = seguros.slice(0, 5);
        this.cargandoSegurosImpagos = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros impagos', err);
        this.cargandoSegurosImpagos = false;
      }
    });
  }

  cargarDatosReembolsosPendientes(): void {
    this.cargandoReembolsosPendientes = true;
    this.reporteService.getReembolsosPendientes().subscribe({
      next: (reembolsos) => {
        this.totalReembolsosPendientes = reembolsos.length;
        this.ultimosReembolsosPendientes = reembolsos.slice(0, 5);
        this.cargandoReembolsosPendientes = false;
      },
      error: (err) => {
        console.error('Error al cargar reembolsos pendientes', err);
        this.cargandoReembolsosPendientes = false;
      }
    });
  }

  cargarDatosContratosVencidos(): void {
    this.cargandoContratosVencidos = true;
    this.reporteService.getContratosVencidos().subscribe({
      next: (contratos) => {
        this.totalContratosVencidos = contratos.length;
        this.ultimosContratosVencidos = contratos.slice(0, 5);
        this.cargandoContratosVencidos = false;
      },
      error: (err) => {
        console.error('Error al cargar contratos vencidos', err);
        this.cargandoContratosVencidos = false;
      }
    });
  }

  cargarDatosContratosPorVencer(): void {
    this.cargandoContratosPorVencer = true;
    this.reporteService.getContratosPorVencer().subscribe({
      next: (contratos) => {
        this.totalContratosPorVencer = contratos.length;
        this.ultimosContratosPorVencer = contratos.slice(0, 5);
        this.cargandoContratosPorVencer = false;
      },
      error: (err) => {
        console.error('Error al cargar contratos por vencer', err);
        this.cargandoContratosPorVencer = false;
      }
    });
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarDatosSegurosImpagos();
    this.cargarDatosReembolsosPendientes();
    this.cargarDatosContratosVencidos();
    this.cargarDatosContratosPorVencer();
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
}
