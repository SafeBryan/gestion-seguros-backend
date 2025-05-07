import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { SeguroService } from '../../core/services/seguro.service';
import { Usuario } from '../../models/usuario.model';
import { Seguro } from '../../models/seguro.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
}