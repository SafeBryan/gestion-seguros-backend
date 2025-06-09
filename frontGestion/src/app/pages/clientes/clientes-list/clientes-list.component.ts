import { Component, OnInit } from '@angular/core';
import { ClienteResponseDTO } from '../../../models/cliente-response.dto';
import { ClienteService } from '../../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientesFormComponent } from '../clientes-form/clientes-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-clientes-list',
  imports: [FormsModule, CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent implements OnInit {
  clientes: ClienteResponseDTO[] = [];
  clientesFiltrados: ClienteResponseDTO[] = [];
  filtro: string = '';

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.filtrar();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  filtrar(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(filtroLower) ||
        cliente.apellido.toLowerCase().includes(filtroLower) ||
        cliente.numeroIdentificacion.toLowerCase().includes(filtroLower) ||
        cliente.email.toLowerCase().includes(filtroLower)
    );
  }

  editarCliente(id: number): void {
    const dialogRef = this.dialog.open(ClientesFormComponent, {
      width: '600px',
      data: { clienteId: id },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === 'guardado') {
        this.cargarClientes();
      }
    });
  }

  desactivarCliente(id: number): void {
    if (confirm('¿Está seguro de desactivar este cliente?')) {
      this.clienteService.desactivarCliente(id).subscribe(() => {
        this.cargarClientes();
      });
    }
  }

  abrirFormularioNuevoCliente(): void {
    const dialogRef = this.dialog.open(ClientesFormComponent, {
      width: '600px',
      data: null, // para indicar que es nuevo
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado === 'guardado') {
        this.cargarClientes(); // recarga la tabla
      }
    });
  }
}
