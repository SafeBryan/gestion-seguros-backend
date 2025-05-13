import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Contrato } from '../../../models/contrato.model';
import { SeguroService } from '../../../core/services/seguro.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'app-contratos-form',
  standalone: true,
  templateUrl: './contratos-form.component.html',
  styleUrls: ['./contratos-form.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ContratosFormComponent implements OnInit {
  @Input() contrato?: Contrato;
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  seguros: any[] = [];
  agentes: any[] = [];

  constructor(
    private seguroService: SeguroService,
    private usuarioService: UsuarioService,
    private contratoService: ContratoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.contrato = this.contrato
      ? { ...this.contrato }
      : this.getNuevoContrato();

    this.cargarSeguros();
    this.cargarAgentes();
  }

  getNuevoContrato(): Contrato {
    return {
      clienteId: this.authService.getUsuarioId(),
      seguroId: undefined,
      agenteId: undefined,
      fechaInicio: '',
      fechaFin: '',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      firmaElectronica: '',
      beneficiarios: [],
    };
  }

  cargarSeguros(): void {
    this.seguroService.obtenerSegurosActivos().subscribe((data) => {
      this.seguros = data;
    });
  }

  cargarAgentes(): void {
    this.usuarioService.obtenerPorRol('AGENTE').subscribe((data) => {
      this.agentes = data;
    });
  }

  agregarBeneficiario(): void {
    this.contrato!.beneficiarios.push({
      nombre: '',
      parentesco: '',
      porcentaje: 0,
    });
  }

  eliminarBeneficiario(index: number): void {
    this.contrato!.beneficiarios.splice(index, 1);
  }

  guardarContrato(): void {
    const accion = this.contrato!.id
      ? this.contratoService.actualizarContrato(this.contrato!)
      : this.contratoService.crearContrato(this.contrato!);

    accion.subscribe({
      next: () => {
        alert(
          `Contrato ${this.contrato!.id ? 'actualizado' : 'creado'} con éxito`
        );
        this.guardado.emit();
        this.contrato = this.getNuevoContrato();
      },
      error: (err) => console.error('Error al guardar contrato', err),
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
