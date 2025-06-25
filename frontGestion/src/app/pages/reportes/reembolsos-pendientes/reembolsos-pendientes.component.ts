import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../core/services/reporte.service';
import { PdfService } from '../../../core/services/pdf.service';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

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
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './reembolsos-pendientes.component.html',
  styleUrl: './reembolsos-pendientes.component.css'
})
export class ReembolsosPendientesComponent implements OnInit {
  reembolsosPendientes: any[] = [];
  reembolsosPendientesFiltrados: any[] = [];
  cargando = true;
  totalReembolsos = 0;
  totalMonto = 0;
  today = new Date();
  
  // Filtros de fecha
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  constructor(
    private reporteService: ReporteService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.cargarReembolsosPendientes();
  }

  cargarReembolsosPendientes(): void {
    this.cargando = true;
    this.reporteService.getReembolsosPendientes().subscribe({
      next: (reembolsos) => {
        this.reembolsosPendientes = reembolsos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reembolsos pendientes', err);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.reembolsosPendientes];

    // Filtrar por fecha de solicitud
    if (this.fechaInicio) {
      filtrados = filtrados.filter(reembolso => {
        const fechaReembolso = new Date(reembolso.fechaSolicitud);
        return fechaReembolso >= this.fechaInicio!;
      });
    }

    // Filtrar por fecha de fin
    if (this.fechaFin) {
      filtrados = filtrados.filter(reembolso => {
        const fechaReembolso = new Date(reembolso.fechaSolicitud);
        return fechaReembolso <= this.fechaFin!;
      });
    }

    this.reembolsosPendientesFiltrados = filtrados;
    this.totalReembolsos = filtrados.length;
    this.totalMonto = filtrados.reduce((sum, reembolso) => sum + reembolso.monto, 0);
  }

  limpiarFiltros(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.aplicarFiltros();
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Método para formatear precio
  formatearPrecio(precio: number): string {
    if (precio == null) return '-';
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
    const ids = this.reembolsosPendientesFiltrados.map(r => r.clienteId);
    return Array.from(new Set(ids)).length;
  }

  // Método para generar PDF
  generarPdf(): void {
    const titulo = 'Reporte de Reembolsos Pendientes';
    const subtitulo = 'Listado detallado de reembolsos en espera de aprobación';
    
    // Preparar datos para el PDF
    const datos = this.reembolsosPendientesFiltrados.map(reembolso => [
      reembolso.clienteNombre,
      reembolso.seguroNombre,
      this.formatearPrecio(reembolso.monto),
      reembolso.descripcion,
      this.formatearFecha(reembolso.fechaSolicitud),
      `${this.getDiasTranscurridos(reembolso.fechaSolicitud)} días`,
      this.getEstadoReembolso(reembolso.estado)
    ]);

    const columnas = [
      'Cliente',
      'Seguro',
      'Monto',
      'Descripción',
      'Fecha Solicitud',
      'Días Transcurridos',
      'Estado'
    ];

    // Preparar resumen
    const resumen = {
      'Total Reembolsos': this.totalReembolsos,
      'Monto Total': `$${this.formatearPrecio(this.totalMonto)}`,
      'Clientes Afectados': this.getTotalClientesAfectados(),
      'Promedio por Reembolso': `$${this.formatearPrecio(this.totalReembolsos > 0 ? this.totalMonto / this.totalReembolsos : 0)}`,
      'Fecha de Generación': new Date().toLocaleDateString('es-ES')
    };

    this.pdfService.generarPdfCompleto(
      titulo,
      subtitulo,
      resumen,
      datos,
      columnas,
      'reembolsos-pendientes'
    );
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarReembolsosPendientes();
  }
}
