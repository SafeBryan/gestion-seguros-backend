import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { SeguroService } from '../../core/services/seguro.service';
import { Usuario } from '../../models/usuario.model';
import { Seguro } from '../../models/seguro.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Contadores para las estadísticas
  totalUsuarios = 0;
  usuariosActivos = 0;
  usuariosInactivos = 0;
  totalSeguros = 0;
  segurosSalud = 0;
  segurosVida = 0;
  segurosActivos = 0;
  segurosInactivos = 0;

  // Listas para mostrar los últimos registros
  ultimosUsuarios: Usuario[] = [];
  ultimosSeguros: Seguro[] = [];

  // Control de carga
  cargandoUsuarios = true;
  cargandoSeguros = true;
  // Fecha actual para mostrar en el dashboard
  today = new Date();

   // Valores para gráficos de actividad mensual (simulado)
  actividadMensual = {
    usuariosNuevos: [15, 20, 18, 25, 30, 28, 35, 32, 38, 42, 45, 50],
    segurosNuevos: [5, 8, 10, 12, 15, 14, 18, 20, 22, 25, 28, 30]
  };
   // Meses para labels del gráfico
  meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  // Mes actual
  mesActual = new Date().getMonth();

  constructor(
    private usuarioService: UsuarioService,
    private seguroService: SeguroService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuarios();
    this.cargarDatosSeguros();
  }

  cargarDatosUsuarios(): void {
    this.cargandoUsuarios = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (usuarios) => {
        this.totalUsuarios = usuarios.length;
        this.usuariosActivos = usuarios.filter(u => u.activo).length;
        this.usuariosInactivos = usuarios.filter(u => !u.activo).length;
        
        // Ordenar por ID (asumiendo que los más recientes tienen ID mayor)
        // y tomar los últimos 5
        this.ultimosUsuarios = [...usuarios]
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 5);
        
        this.cargandoUsuarios = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.cargandoUsuarios = false;
      }
    });
  }

  cargarDatosSeguros(): void {
    this.cargandoSeguros = true;
    this.seguroService.obtenerTodosLosSeguros().subscribe({
      next: (seguros) => {
        this.totalSeguros = seguros.length;
        this.segurosSalud = seguros.filter(s => s.tipo === 'SALUD').length;
        this.segurosVida = seguros.filter(s => s.tipo === 'VIDA').length;
        this.segurosActivos = seguros.filter(s => s.activo).length;
        this.segurosInactivos = seguros.filter(s => !s.activo).length;
        
        // Ordenar por ID (asumiendo que los más recientes tienen ID mayor)
        // y tomar los últimos 5
        this.ultimosSeguros = [...seguros]
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 5);
        
        this.cargandoSeguros = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros', err);
        this.cargandoSeguros = false;
      }
    });
  }

  // Método para determinar el color del progreso según el porcentaje
  getProgressColor(percentage: number): string {
    if (percentage < 30) return 'bg-danger';
    if (percentage < 70) return 'bg-warning';
    return 'bg-success';
  }
  /// nuevooos


    // Método para obtener las iniciales de un nombre completo
  getInitials(nombre: string, apellido: string): string {
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

    // Método para formatear precio con separador de miles
  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

    // Obtener los últimos 6 meses para las gráficas
  getUltimosSeisMeses(): string[] {
    const result = [];
    let currentMonth = this.mesActual;
    
    for (let i = 0; i < 6; i++) {
      result.unshift(this.meses[currentMonth]);
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    }
    
    return result;
  }

    // Obtener datos de actividad de los últimos 6 meses
  getActividadUltimosMeses(tipo: 'usuariosNuevos' | 'segurosNuevos'): number[] {
    const result = [];
    let currentMonth = this.mesActual;
    
    for (let i = 0; i < 6; i++) {
      result.unshift(this.actividadMensual[tipo][currentMonth]);
      currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    }
    
    return result;
  }
  
  // Método para refrescar datos
  refreshData(): void {
    this.cargarDatosUsuarios();
    this.cargarDatosSeguros();
  }
}