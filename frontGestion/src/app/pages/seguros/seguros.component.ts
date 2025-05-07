import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SeguroService } from '../../core/services/seguro.service';
import { Seguro } from '../../models/seguro.model';
import { AuthService } from '../../services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-seguros',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    NgIf,
    NgFor
  ],
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
})
export class SegurosComponent implements OnInit {
  seguros: Seguro[] = [];
  segurosActivos: Seguro[] = [];
  segurosInactivos: Seguro[] = [];
  loading = true;

  mostrarModal = false;

  nuevoSeguro: Omit<Seguro, 'id' | 'creadoPorId'> = {
    nombre: '',
    tipo: 'VIDA',
    descripcion: '',
    cobertura: '',
    precioAnual: 0,
    activo: true
  };

  constructor(private seguroService: SeguroService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarSeguros();
  }

  cargarSeguros(): void {
    this.seguroService.obtenerTodosLosSeguros().subscribe({
      next: (data) => {
        this.seguros = data;
        this.segurosActivos = data.filter(s => s.activo);
        this.segurosInactivos = data.filter(s => !s.activo);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros', err);
        this.loading = false;
      }
    });
  }

  trackBySeguroId(index: number, seguro: Seguro): number {
    return seguro.id;
  }

  crearSeguro(): void {
    this.nuevoSeguro = {
      nombre: '',
      tipo: 'VIDA',
      descripcion: '',
      cobertura: '',
      precioAnual: 0,
      activo: true
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarSeguro(): void {
    // Aquí se incluye el `creadoPorId`
    const seguroConUsuario = { ...this.nuevoSeguro, creadoPorId: this.authService.getUsuarioId() };
    console.log(this.authService.getUsuarioId());
    this.seguroService.crearSeguro(seguroConUsuario).subscribe({
      next: () => {
        this.cargarSeguros();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar el seguro', err);
      }
    });
  }

  editarSeguro(seguro: Seguro): void {
    console.log('Editar seguro', seguro);
    this.nuevoSeguro = {
      nombre: seguro.nombre,
      tipo: seguro.tipo,
      descripcion: seguro.descripcion,
      cobertura: seguro.cobertura,
      precioAnual: seguro.precioAnual,
      activo: seguro.activo
    };
    this.mostrarModal = true;
  }

  eliminarSeguro(seguro: Seguro): void {
    console.log('Eliminar seguro', seguro);
  }
}
