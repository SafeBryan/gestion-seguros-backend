import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioService, RegistroDTO } from '../../core/services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgIf,
    NgFor
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  mostrarModal = false;

  nuevoUsuario: RegistroDTO = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rolId: 0
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.obtenerTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.loading = false;
      }
    });
  }

  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id!;
  }

  crearUsuario(): void {
    this.nuevoUsuario = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      telefono: '',
      rolId: 0
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarUsuario(): void {
    this.usuarioService.crear(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al crear usuario', err);
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuario', usuario);
    // Lógica futura
  }

  eliminarUsuario(usuario: Usuario): void {
    console.log('Eliminar usuario', usuario);
    // Lógica futura
  }
}
