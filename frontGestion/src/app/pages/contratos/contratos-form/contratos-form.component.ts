import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { Contrato } from '../../../models/contrato.model';
import { SeguroService } from '../../../core/services/seguro.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-contratos-form',
  standalone: true,
  templateUrl: './contratos-form.component.html',
  styleUrls: ['./contratos-form.component.css'],
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
})
export class ContratosFormComponent implements OnInit {
  @Input() contrato?: Contrato;
  @Output() guardado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  seguros: any[] = [];
  agentes: any[] = [];
  loading = false;

  constructor(
    private seguroService: SeguroService,
    private usuarioService: UsuarioService,
    private contratoService: ContratoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
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
    this.loading = true;
    this.seguroService.obtenerSegurosActivos().subscribe({
      next: (data) => {
        this.seguros = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar seguros', err);
        this.snackBar.open('Error al cargar los seguros', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  cargarAgentes(): void {
    this.loading = true;
    this.usuarioService.obtenerPorRol('AGENTE').subscribe({
      next: (data) => {
        this.agentes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar agentes', err);
        this.snackBar.open('Error al cargar los agentes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
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
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    const accion = this.contrato!.id
      ? this.contratoService.actualizarContrato(this.contrato!)
      : this.contratoService.crearContrato(this.contrato!);

    accion.subscribe({
      next: () => {
        this.snackBar.open(
          `Contrato ${this.contrato!.id ? 'actualizado' : 'creado'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
        this.loading = false;
        this.guardado.emit();
        this.contrato = this.getNuevoContrato();
      },
      error: (err) => {
        console.error('Error al guardar contrato', err);
        this.snackBar.open('Error al guardar el contrato', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  validarFormulario(): boolean {
    if (!this.contrato?.seguroId) {
      this.snackBar.open('Debe seleccionar un seguro', 'Cerrar', { duration: 3000 });
      return false;
    }
    if (!this.contrato?.agenteId) {
      this.snackBar.open('Debe seleccionar un agente', 'Cerrar', { duration: 3000 });
      return false;
    }
    if (!this.contrato?.fechaInicio) {
      this.snackBar.open('Debe establecer una fecha de inicio', 'Cerrar', { duration: 3000 });
      return false;
    }
    if (!this.contrato?.fechaFin) {
      this.snackBar.open('Debe establecer una fecha de fin', 'Cerrar', { duration: 3000 });
      return false;
    }
    
    // Validar beneficiarios
    if (this.contrato.beneficiarios.length > 0) {
      let porcentajeTotal = 0;
      for (const beneficiario of this.contrato.beneficiarios) {
        if (!beneficiario.nombre || !beneficiario.parentesco || beneficiario.porcentaje <= 0) {
          this.snackBar.open('Todos los campos de beneficiarios deben estar completos', 'Cerrar', { duration: 3000 });
          return false;
        }
        porcentajeTotal += beneficiario.porcentaje;
      }
      
      if (porcentajeTotal >= 100) {
        this.snackBar.open('El porcentaje total de beneficiarios debe ser menor al 100%', 'Cerrar', { duration: 3000 });
        return false;
      }
    }
    
    return true;
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}