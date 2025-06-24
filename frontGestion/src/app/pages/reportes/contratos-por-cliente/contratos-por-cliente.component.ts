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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { ClienteResponseDTO } from '../../../models/cliente-response.dto';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contratos-por-cliente',
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
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './contratos-por-cliente.component.html',
  styleUrl: './contratos-por-cliente.component.css'
})
export class ContratosPorClienteComponent implements OnInit {
  contratosPorCliente: any[] = [];
  cargando = true;
  totalContratos = 0;
  clienteId: number = 0;
  today = new Date();

  clientes: ClienteResponseDTO[] = [];
  cargandoClientes = true;

  constructor(private reporteService: ReporteService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargandoClientes = true;
    this.clienteService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargandoClientes = false;
        // Selecciona el primer cliente por defecto si hay clientes
        if (clientes.length > 0) {
          this.clienteId = clientes[0].id;
          this.buscarContratosPorCliente(this.clienteId);
        }
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.cargandoClientes = false;
      }
    });
  }

  buscarContratosPorCliente(id: number): void {
    this.cargando = true;
    this.clienteId = id;
    this.reporteService.getContratosPorCliente(id).subscribe({
      next: (contratos) => {
        this.contratosPorCliente = contratos;
        this.totalContratos = contratos.length;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar contratos por cliente', err);
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

  // Método para calcular el total de contratos activos
  getContratosActivos(): number {
    return this.contratosPorCliente.filter(c => c.estado === 'ACTIVO').length;
  }

  // Método para calcular el total de contratos vencidos
  getContratosVencidos(): number {
    return this.contratosPorCliente.filter(c => c.estado === 'VENCIDO').length;
  }

  // Método para calcular el valor total de contratos
  getValorTotalContratos(): number {
    return this.contratosPorCliente.reduce((sum, contrato) => sum + contrato.seguro.precioAnual, 0);
  }

  // Método para refrescar datos
  refreshData(): void {
    this.buscarContratosPorCliente(this.clienteId);
  }

  // Método para manejar el cambio de cliente
  onClienteChange(event: any): void {
    const id = parseInt(event.target.value);
    if (id > 0) {
      this.buscarContratosPorCliente(id);
    }
  }
}
