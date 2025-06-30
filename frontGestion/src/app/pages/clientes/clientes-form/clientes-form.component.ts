import { Component, Inject, OnInit, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ClienteRequestDTO } from '../../../models/cliente-request.dto';
import { Usuario } from '../../../models/usuario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Angular Material Imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css'],
})
export class ClientesFormComponent implements OnInit {
  @ViewChild('form') form?: NgForm;

  cliente: ClienteRequestDTO = {
    usuarioId: 0,
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    fechaNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
    sexo: '',
    lugarNacimiento: '',
    estatura: 0,
    peso: 0,
    direccion: '',
  };

  usuariosClienteDisponibles: Usuario[] = [];
  isEditando: boolean = false;
  clienteId?: number;
  loading: boolean = false;

  // Opciones para los selects
  tiposIdentificacion = [
    { value: 'Cédula', label: 'Cédula' },
    { value: 'Pasaporte', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' },
  ];

  estadosCiviles = [
    { value: 'Soltero', label: 'Soltero' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viudo', label: 'Viudo' },
    { value: 'Unión Libre', label: 'Unión Libre' },
  ];

  sexos = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
  ];

  // Servicios inyectados
  private dialogRef = inject(MatDialogRef<ClientesFormComponent>);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  public data: any = inject(MAT_DIALOG_DATA);

  // Getter para verificar si el formulario es válido
  get isFormValid(): boolean {
    // Si el form no está disponible aún, usar validación manual
    if (!this.form) {
      const camposRequeridos = [
        this.cliente.tipoIdentificacion,
        this.cliente.numeroIdentificacion,
        this.cliente.fechaNacimiento
      ];

      // Si no está editando, también requiere usuario
      if (!this.isEditando) {
        camposRequeridos.push(this.cliente.usuarioId > 0 ? 'valid' : '');
      }

      return camposRequeridos.every(campo => campo && campo.toString().trim() !== '');
    }
    
    // Si el form está disponible, usar su validación
    return this.form.valid ?? false;
  }

  ngOnInit(): void {
    this.cargarUsuariosCliente();

    if (this.data?.clienteId) {
      this.isEditando = true;
      this.clienteId = this.data.clienteId;
      this.cargarCliente(this.clienteId!);
    }
  }

  cargarUsuariosCliente(): void {
    this.loading = true;
    this.usuarioService.obtenerPorRol('CLIENTE').subscribe({
      next: (usuarios) => {
        this.usuariosClienteDisponibles = usuarios.filter((u) => u.activo);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.mostrarNotificacion('Error al cargar usuarios', 'error');
        this.loading = false;
      },
    });
  }

  cargarCliente(id: number): void {
    this.loading = true;
    this.clienteService.obtenerCliente(id).subscribe({
      next: (clienteResponse) => {
        // Mapear la respuesta al formato de request
        this.cliente = {
          usuarioId: clienteResponse.id,
          tipoIdentificacion: clienteResponse.tipoIdentificacion,
          numeroIdentificacion: clienteResponse.numeroIdentificacion,
          fechaNacimiento: clienteResponse.fechaNacimiento,
          nacionalidad: clienteResponse.nacionalidad,
          estadoCivil: clienteResponse.estadoCivil,
          sexo: clienteResponse.sexo,
          lugarNacimiento: clienteResponse.lugarNacimiento,
          estatura: clienteResponse.estatura,
          peso: clienteResponse.peso,
          direccion: clienteResponse.direccion,
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cliente:', error);
        this.mostrarNotificacion('Error al cargar cliente', 'error');
        this.loading = false;
      },
    });
  }

  guardar(): void {
    if (this.validarFormulario()) {
      this.loading = true;
      
      if (this.isEditando && this.clienteId) {
        this.clienteService
          .actualizarCliente(this.clienteId, this.cliente)
          .subscribe({
            next: () => {
              this.loading = false;
              this.mostrarNotificacion('Cliente actualizado correctamente', 'success');
              this.dialogRef.close('guardado');
            },
            error: (error) => {
              console.error('Error al actualizar cliente:', error);
              this.mostrarNotificacion('Error al actualizar cliente', 'error');
              this.loading = false;
            },
          });
      } else {
        this.clienteService.crearCliente(this.cliente).subscribe({
          next: () => {
            this.loading = false;
            this.mostrarNotificacion('Cliente creado correctamente', 'success');
            this.dialogRef.close('guardado');
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            this.mostrarNotificacion('Error al crear cliente', 'error');
            this.loading = false;
          },
        });
      }
    }
  }

  validarFormulario(): boolean {
    if (!this.isEditando && !this.cliente.usuarioId) {
      this.mostrarNotificacion('Debe seleccionar un usuario', 'error');
      return false;
    }

    if (!this.cliente.tipoIdentificacion) {
      this.mostrarNotificacion('Debe seleccionar el tipo de identificación', 'error');
      return false;
    }

    if (!this.cliente.numeroIdentificacion) {
      this.mostrarNotificacion('Debe ingresar el número de identificación', 'error');
      return false;
    }

    if (!this.cliente.fechaNacimiento) {
      this.mostrarNotificacion('Debe seleccionar la fecha de nacimiento', 'error');
      return false;
    }

    return true;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar'],
    });
  }

  // Método para formatear la fecha para el input date
  formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';
    return fecha.split('T')[0]; // Toma solo la parte de la fecha
  }
}