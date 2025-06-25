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
  selector: 'app-contratos-por-vencer',
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
  templateUrl: './contratos-por-vencer.component.html',
  styleUrl: './contratos-por-vencer.component.css'
})
export class ContratosPorVencerComponent implements OnInit {
  contratosPorVencer: any[] = [];
  contratosPorVencerFiltrados: any[] = [];
  cargando = true;
  totalContratos = 0;
  today = new Date();
  
  // Filtros de fecha
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  constructor(
    private reporteService: ReporteService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.cargarContratosPorVencer();
  }

  cargarContratosPorVencer(): void {
    this.cargando = true;
    this.reporteService.getContratosPorVencer().subscribe({
      next: (contratos) => {
        this.contratosPorVencer = contratos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar contratos por vencer', err);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.contratosPorVencer];

    // Filtrar por fecha de vencimiento
    if (this.fechaInicio) {
      filtrados = filtrados.filter(contrato => {
        const fechaVencimiento = new Date(contrato.fechaFin);
        return fechaVencimiento >= this.fechaInicio!;
      });
    }

    // Filtrar por fecha de fin
    if (this.fechaFin) {
      filtrados = filtrados.filter(contrato => {
        const fechaVencimiento = new Date(contrato.fechaFin);
        return fechaVencimiento <= this.fechaFin!;
      });
    }

    this.contratosPorVencerFiltrados = filtrados;
    this.totalContratos = filtrados.length;
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

  // Método para calcular días hasta el vencimiento
  getDiasHastaVencimiento(fechaFin: string): number {
    const fecha = new Date(fechaFin);
    const hoy = new Date();
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Método para obtener el nivel de urgencia
  getNivelUrgencia(dias: number): string {
    if (dias <= 7) return 'danger';
    if (dias <= 30) return 'warning';
    if (dias <= 90) return 'info';
    return 'success';
  }

  // Método para refrescar datos
  refreshData(): void {
    this.cargarContratosPorVencer();
  }

  // Métodos para el template (evitar expresiones complejas en HTML)
  getContratosPorVencerEn7Dias(): number {
    return this.contratosPorVencerFiltrados.filter(c => this.getDiasHastaVencimiento(c.fechaFin) <= 7).length;
  }

  getContratosPorVencerEn8a30Dias(): number {
    return this.contratosPorVencerFiltrados.filter(c => this.getDiasHastaVencimiento(c.fechaFin) > 7 && this.getDiasHastaVencimiento(c.fechaFin) <= 30).length;
  }

  getTotalClientesAfectados(): number {
    const ids = this.contratosPorVencerFiltrados.map(c => c.clienteId);
    return Array.from(new Set(ids)).length;
  }

  // Método para generar PDF
  generarPdf(): void {
    const titulo = 'Reporte de Contratos por Vencer';
    const subtitulo = 'Listado detallado de contratos próximos a vencer';
    
    // Preparar datos para el PDF
    const datos = this.contratosPorVencerFiltrados.map(contrato => [
      `Cliente ID: ${contrato.clienteId}`,
      contrato.seguro.nombre,
      `${contrato.agente.nombre} ${contrato.agente.apellido}`,
      this.formatearFecha(contrato.fechaInicio),
      this.formatearFecha(contrato.fechaFin),
      `${this.getDiasHastaVencimiento(contrato.fechaFin)} días`,
      contrato.frecuenciaPago,
      this.getEstadoContrato(contrato.estado)
    ]);

    const columnas = [
      'Cliente',
      'Seguro',
      'Agente',
      'Fecha Inicio',
      'Fecha Fin',
      'Días Restantes',
      'Frecuencia',
      'Estado'
    ];

    // Preparar resumen
    const resumen = {
      'Total Contratos por Vencer': this.totalContratos,
      'Clientes Afectados': this.getTotalClientesAfectados(),
      'Vencen en menos o igual a 7 días': this.getContratosPorVencerEn7Dias(),
      'Vencen en 8-30 días': this.getContratosPorVencerEn8a30Dias(),
      'Fecha de Generación': new Date().toLocaleDateString('es-ES')
    };

    this.pdfService.generarPdfCompleto(
      titulo,
      subtitulo,
      resumen,
      datos,
      columnas,
      'contratos-por-vencer'
    );
  }
}
