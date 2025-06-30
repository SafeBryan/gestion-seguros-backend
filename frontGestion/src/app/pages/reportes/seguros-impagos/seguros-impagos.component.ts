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
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './seguros-impagos.component.html',
  styleUrl: './seguros-impagos.component.css'
})
export class SegurosImpagosComponent implements OnInit {
  segurosImpagos: any[] = [];
  segurosImpagosFiltrados: any[] = [];
  cargando = true;
  totalSeguros = 0;
  today = new Date();
  
  // Filtros de fecha
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  constructor(
    private reporteService: ReporteService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.cargarSegurosImpagos();
  }

  cargarSegurosImpagos(): void {
    this.cargando = true;
    this.reporteService.getSegurosImpagos().subscribe({
      next: (seguros) => {
        this.segurosImpagos = seguros;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros impagos', err);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.segurosImpagos];

    // Filtrar por fecha de inicio
    if (this.fechaInicio) {
      filtrados = filtrados.filter(seguro => {
        const fechaSeguro = new Date(seguro.fechaInicio);
        return fechaSeguro >= this.fechaInicio!;
      });
    }

    // Filtrar por fecha de fin
    if (this.fechaFin) {
      filtrados = filtrados.filter(seguro => {
        const fechaSeguro = new Date(seguro.fechaFin);
        return fechaSeguro <= this.fechaFin!;
      });
    }

    this.segurosImpagosFiltrados = filtrados;
    this.totalSeguros = filtrados.length;
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
    return this.segurosImpagosFiltrados.filter(s => s.estado === 'ACTIVO').length;
  }

  // Método para contar clientes únicos
  getTotalClientesAfectados(): number {
    const ids = this.segurosImpagosFiltrados.map(s => s.clienteId);
    return Array.from(new Set(ids)).length;
  }

  // Método para generar PDF
  generarPdf(): void {
    const titulo = 'Reporte de Seguros Impagos';
    const subtitulo = 'Listado detallado de seguros con pagos pendientes';
    
    // Preparar datos para el PDF
    const datos = this.segurosImpagosFiltrados.map(seguro => [
      `Cliente ID: ${seguro.clienteId}`,
      seguro.seguro.nombre,
      `${seguro.agente.nombre} ${seguro.agente.apellido}`,
      this.formatearFecha(seguro.fechaInicio),
      this.formatearFecha(seguro.fechaFin),
      seguro.frecuenciaPago,
      'Impago'
    ]);

    const columnas = [
      'Cliente',
      'Seguro',
      'Agente',
      'Fecha Inicio',
      'Fecha Fin',
      'Frecuencia',
      'Estado'
    ];

    // Preparar resumen
    const resumen = {
      'Total Seguros Impagos': this.totalSeguros,
      'Contratos Activos': this.getContratosActivos(),
      'Clientes Afectados': this.getTotalClientesAfectados(),
      'Fecha de Generación': new Date().toLocaleDateString('es-ES')
    };

    this.pdfService.generarPdfCompleto(
      titulo,
      subtitulo,
      resumen,
      datos,
      columnas,
      'seguros-impagos'
    );
  }
}
