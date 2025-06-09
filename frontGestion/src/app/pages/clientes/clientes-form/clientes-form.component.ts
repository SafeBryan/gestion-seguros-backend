import { Component, Inject, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ClienteRequestDTO } from '../../../models/cliente-request.dto';
import { Usuario } from '../../../models/usuario.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.css',
})
export class ClientesFormComponent implements OnInit {
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

  // Servicios inyectados
  private dialogRef = inject(MatDialogRef<ClientesFormComponent>);
  private clienteService = inject(ClienteService);
  private usuarioService = inject(UsuarioService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { clienteId?: number }) {}

  ngOnInit(): void {
    this.cargarUsuariosCliente();

    if (this.data?.clienteId) {
      this.isEditando = true;
      this.clienteId = this.data.clienteId;
      this.cargarCliente(this.clienteId);
    }
  }

  cargarUsuariosCliente(): void {
    this.usuarioService.obtenerPorRol('CLIENTE').subscribe({
      next: (usuarios) => {
        this.usuariosClienteDisponibles = usuarios.filter((u) => u.activo);
      },
    });
  }

  cargarCliente(id: number): void {
    this.clienteService.obtenerCliente(id).subscribe((cliente) => {
      this.cliente = {
        usuarioId: cliente.id,
        tipoIdentificacion: cliente.tipoIdentificacion,
        numeroIdentificacion: cliente.numeroIdentificacion,
        fechaNacimiento: cliente.fechaNacimiento,
        nacionalidad: cliente.nacionalidad,
        estadoCivil: cliente.estadoCivil,
        sexo: cliente.sexo,
        lugarNacimiento: cliente.lugarNacimiento,
        estatura: cliente.estatura,
        peso: cliente.peso,
        direccion: cliente.direccion,
      };
    });
  }

  guardar(): void {
    if (this.isEditando && this.clienteId) {
      this.clienteService
        .actualizarCliente(this.clienteId, this.cliente)
        .subscribe(() => {
          this.dialogRef.close('guardado');
        });
    } else {
      this.clienteService.crearCliente(this.cliente).subscribe(() => {
        this.dialogRef.close('guardado');
      });
    }
  }
}
