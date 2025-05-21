import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UsuarioService, RegistroDTO } from '../../core/services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RolService } from '../../core/services/rol.service';
import { Rol } from '../../models/rol.model';
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
  modoEdicion = false;
  usuarioEditando: Usuario | null = null;
  roles: Rol[] = [];

  nuevoUsuario: RegistroDTO = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    rolId: 0
  };

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}
  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.obtenerTodos().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
      }
    });
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
    this.modoEdicion = false;
    this.usuarioEditando = null;
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
    this.modoEdicion = false;
    this.usuarioEditando = null;
  }

  guardarUsuario(): void {
    if (this.modoEdicion && this.usuarioEditando) {
      // Si estamos en modo edición, actualizamos
      this.usuarioService.editar(this.usuarioEditando.id!, this.nuevoUsuario).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          alert('Usuario actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
          alert('Error al actualizar usuario');
        }
      });
    } else {
      // Si no, creamos un nuevo usuario
      this.usuarioService.crear(this.nuevoUsuario).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
          alert('Usuario creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          alert('Error al crear usuario');
        }
      });
    }
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEditando = usuario;
    
    // Crear un objeto que cumpla con la estructura RegistroDTO para el formulario
    this.nuevoUsuario = {
      email: usuario.email,
      password: '', // Generalmente no se rellena la contraseña en edición
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono || '',
      rolId: usuario.rolId
    };
    
    this.mostrarModal = true;
  }

  eliminarUsuario(usuario: Usuario): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      this.usuarioService.eliminar(usuario.id!).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('Usuario eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          alert('Error al eliminar usuario');
        }
      });
    }
  }
}
