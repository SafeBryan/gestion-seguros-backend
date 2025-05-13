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
    NgFor,
  ],
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css'],
})
export class SegurosComponent implements OnInit {
  seguros: Seguro[] = [];
  segurosActivos: Seguro[] = [];
  segurosInactivos: Seguro[] = [];
  loading = true;
  mostrarModal = false;

  // ✅ Ahora con `id` opcional
  nuevoSeguro: Partial<Seguro> = {
    nombre: '',
    tipo: 'VIDA',
    descripcion: '',
    cobertura: '',
    precioAnual: 0,
    activo: true,
  };

  constructor(
    private seguroService: SeguroService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarSeguros();
  }

  cargarSeguros(): void {
    this.seguroService.obtenerTodosLosSeguros().subscribe({
      next: (data) => {
        this.seguros = data;
        this.segurosActivos = data.filter((s) => s.activo);
        this.segurosInactivos = data.filter((s) => !s.activo);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros', err);
        this.loading = false;
      },
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
      activo: true,
      beneficiarios: '',
      montoCobertura: 0,
      hospitalesConvenio: '',
      numeroConsultasIncluidas: 0,
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarSeguro(): void {
    const usuarioId = this.authService.getUsuarioId();

    const seguroConUsuario: Seguro = {
      ...(this.nuevoSeguro as Seguro), // Forzar a tipo completo
      creadoPorId: usuarioId,
    };

    if (this.nuevoSeguro.id) {
      this.seguroService
        .editarSeguro(this.nuevoSeguro.id, seguroConUsuario)
        .subscribe({
          next: () => {
            this.cargarSeguros();
            this.cerrarModal();
          },
          error: (err) => {
            console.error('Error al editar el seguro', err);
          },
        });
    } else {
      this.seguroService.crearSeguro(seguroConUsuario).subscribe({
        next: () => {
          this.cargarSeguros();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al guardar el seguro', err);
        },
      });
    }
  }

  editarSeguro(seguro: Seguro): void {
    this.nuevoSeguro = {
      id: seguro.id, // 👈 Importante para saber que es edición
      nombre: seguro.nombre,
      tipo: seguro.tipo,
      descripcion: seguro.descripcion,
      cobertura: seguro.cobertura,
      precioAnual: seguro.precioAnual,
      activo: seguro.activo,
      beneficiarios: seguro.beneficiarios || '',
      montoCobertura: seguro.montoCobertura || 0,
      hospitalesConvenio: seguro.hospitalesConvenio || '',
      numeroConsultasIncluidas: seguro.numeroConsultasIncluidas || 0,
    };
    this.mostrarModal = true;
  }

  eliminarSeguro(seguro: Seguro): void {
    if (
      confirm(`¿Seguro que quieres desactivar el seguro "${seguro.nombre}"?`)
    ) {
      this.seguroService.actualizarEstado(seguro.id, false).subscribe({
        next: () => this.cargarSeguros(),
        error: (err) => console.error('Error al desactivar el seguro', err),
      });
    }
  }
}
