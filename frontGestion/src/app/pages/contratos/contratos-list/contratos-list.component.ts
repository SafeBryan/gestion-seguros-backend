import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contrato } from '../../../models/contrato.model';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ContratosListComponent implements OnInit {
  contratos: Contrato[] = [];

  @Output() editar = new EventEmitter<Contrato>(); 

  constructor(
    private contratoService: ContratoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.contratoService
      .obtenerPorCliente(this.authService.getUsuarioId())
      .subscribe({
        next: (data) => (this.contratos = data),
        error: (err) => console.error('Error al cargar contratos', err),
      });
  }

  desactivarContrato(id: number): void {
    this.contratoService.actualizarEstado(id, 'CANCELADO').subscribe({
      next: () => {
        alert('Contrato desactivado');
        this.cargarContratos();
      },
      error: (err) => console.error('Error al desactivar contrato', err),
    });
  }

  editarContrato(contrato: Contrato): void {
    this.editar.emit(contrato); 
  }
}
