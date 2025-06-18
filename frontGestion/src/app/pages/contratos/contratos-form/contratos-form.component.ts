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

import {
  Contrato,
  Beneficiario,
  Dependiente,
} from '../../../models/contrato.model';
import { Seguro } from '../../../models/seguro.model';
import { SeguroService } from '../../../core/services/seguro.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteService } from '../../../core/services/cliente.service';

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

  seguros: Seguro[] = [];
  agentes: any[] = [];
  clientes: any[] = [];
  loading = false;

  // Propiedades para el manejo de tipos de seguro
  tipoSeguroSeleccionado: 'VIDA' | 'SALUD' | null = null;
  mostrarCamposBeneficiarios = false;
  mostrarCamposDependientes = false;

  // Listas para selección
  tiposIdentificacion = ['CEDULA', 'PASAPORTE'];
  tiposParentesco = [
    'CONYUGE',
    'HIJO/A',
    'PADRE',
    'MADRE',
    'HERMANO/A',
    'ABUELO/A',
    'NIETO/A',
    'OTRO',
  ];
  hospitalesDisponibles = [
    'Hospital Metropolitano',
    'Hospital de los Valles',
    'Clínica Internacional',
    'Hospital Vozandes',
    'Hospital del IESS',
    'Hospital Militar',
    'Otro',
  ];

  // Control de porcentajes para beneficiarios
  porcentajeTotal = 0;

  constructor(
    private seguroService: SeguroService,
    private usuarioService: UsuarioService,
    private contratoService: ContratoService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.contrato = this.contrato
      ? { ...this.contrato }
      : this.getNuevoContrato();

    this.cargarSeguros();
    this.cargarAgentes();
    this.cargarClientes();
  }

  getNuevoContrato(): Contrato {
    return {
      clienteId: this.authService.getUsuarioId(),
      seguroId: undefined,
      agenteId: undefined,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      frecuenciaPago: 'MENSUAL',
      estado: 'PENDIENTE',
      firmaElectronica: '',
      beneficiarios: [],
      dependientes: [],
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
        this.snackBar.open('Error al cargar los seguros', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
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
        this.snackBar.open('Error al cargar los agentes', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        console.log('Clientes', data);
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes', err);
        this.snackBar.open('Error al cargar los clientes', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  agregarBeneficiario(): void {
    this.contrato!.beneficiarios.push({
      nombre: '',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '',
      fechaNacimiento: '',
      nacionalidad: '',
      parentesco: '',
      porcentaje: 0,
      estatura: '',
      peso: '',
      lugarNacimiento: '',
    });
    this.calcularPorcentajeTotal();
  }

  eliminarBeneficiario(index: number): void {
    this.contrato!.beneficiarios.splice(index, 1);
    this.calcularPorcentajeTotal();
  }

  agregarDependiente(): void {
    this.contrato!.dependientes.push({
      nombre: '',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '',
      fechaNacimiento: '',
      nacionalidad: '',
      parentesco: '',
      estatura: '',
      peso: '',
      lugarNacimiento: '',
      tieneDiscapacidad: false,
      diagnosticoDiscapacidad: '',
      hospitalCobertura: '',
    });
  }

  eliminarDependiente(index: number): void {
    this.contrato!.dependientes.splice(index, 1);
  }

  onSeguroChange(): void {
    if (!this.contrato?.seguroId) {
      this.tipoSeguroSeleccionado = null;
      this.mostrarCamposBeneficiarios = false;
      this.mostrarCamposDependientes = false;
      return;
    }

    const seguroSeleccionado = this.seguros.find(
      (s) => s.id === this.contrato!.seguroId
    );
    if (seguroSeleccionado) {
      this.tipoSeguroSeleccionado = seguroSeleccionado.tipo;
      this.mostrarCamposBeneficiarios = seguroSeleccionado.tipo === 'VIDA';
      this.mostrarCamposDependientes = seguroSeleccionado.tipo === 'SALUD';

      // Inicializar las listas según el tipo de seguro
      if (
        this.mostrarCamposBeneficiarios &&
        this.contrato!.beneficiarios.length === 0
      ) {
        this.agregarBeneficiario();
      }

      if (
        this.mostrarCamposDependientes &&
        this.contrato!.dependientes.length === 0
      ) {
        this.agregarDependiente();
      }
    }
  }

  calcularPorcentajeTotal(): void {
    this.porcentajeTotal = 0;
    if (this.contrato?.beneficiarios) {
      for (const beneficiario of this.contrato.beneficiarios) {
        this.porcentajeTotal += beneficiario.porcentaje || 0;
      }
    }
  }

  actualizarPorcentaje(): void {
    this.calcularPorcentajeTotal();
  }

  // Método para manejar los cambios de fecha y convertirlos a string
  onFechaChange(event: any, persona: any): void {
    if (event.value) {
      // Convertir la fecha a formato string YYYY-MM-DD
      const fecha = new Date(event.value);
      const fechaStr = fecha.toISOString().split('T')[0];
      persona.fechaNacimiento = fechaStr;
    }
  }

  formatearContrato(): Contrato {
    // Crear una copia del contrato para no modificar el original
    const contratoFormateado: any = { ...this.contrato! };

    // Establecer el estado inicial como ACTIVO
    contratoFormateado.estado = 'ACTIVO';

    // Formatear la fecha de inicio y fin como strings en formato YYYY-MM-DD
    if (
      typeof contratoFormateado.fechaInicio === 'object' &&
      contratoFormateado.fechaInicio !== null
    ) {
      contratoFormateado.fechaInicio = new Date(contratoFormateado.fechaInicio)
        .toISOString()
        .split('T')[0];
    }

    if (
      typeof contratoFormateado.fechaFin === 'object' &&
      contratoFormateado.fechaFin !== null
    ) {
      contratoFormateado.fechaFin = new Date(contratoFormateado.fechaFin)
        .toISOString()
        .split('T')[0];
    }

    // Obtener el tipo de seguro seleccionado
    const seguroSeleccionado = this.seguros.find(
      (s) => s.id === contratoFormateado.seguroId
    );

    // Formatear según el tipo de seguro
    if (seguroSeleccionado?.tipo === 'VIDA') {
      // Para seguro de VIDA, asegurarse que los beneficiarios estén correctamente formateados
      if (
        contratoFormateado.beneficiarios &&
        contratoFormateado.beneficiarios.length > 0
      ) {
        // Crear un nuevo array con el formato correcto para la API
        const beneficiariosFormateados = contratoFormateado.beneficiarios.map(
          (beneficiario: any) => ({
            nombre: beneficiario.nombre,
            parentesco: beneficiario.parentesco,
            porcentaje: beneficiario.porcentaje,
            esPrincipal: beneficiario.esPrincipal ? 1 : 0,
            documentoIdentidad: beneficiario.numeroIdentificacion,
            email: beneficiario.email || '',
            telefono: beneficiario.telefono || '',
            fechaNacimiento: beneficiario.fechaNacimiento,
          })
        );

        // Asignar el nuevo array formateado
        contratoFormateado.beneficiarios = beneficiariosFormateados;
      }

      // Para evitar errores con propiedades no opcionales, usamos delete en el objeto 'any'
      if ('dependientes' in contratoFormateado) {
        delete contratoFormateado.dependientes;
      }
    } else if (seguroSeleccionado?.tipo === 'SALUD') {
      // Para seguro de SALUD, mantener los dependientes como están, pero eliminar los beneficiarios
      if ('beneficiarios' in contratoFormateado) {
        delete contratoFormateado.beneficiarios;
      }
    }

    console.log('Contrato formateado:', contratoFormateado);
    return contratoFormateado as Contrato;
  }

  guardarContrato(): void {
    if (!this.validarFormulario()) {
      return;
    }
    this.loading = true;

    // Preparar el contrato según el tipo de seguro
    const contratoFormateado = this.formatearContrato();

    const accion = this.contrato!.id
      ? this.contratoService.actualizarContrato(contratoFormateado)
      : this.contratoService.crearContrato(contratoFormateado);

    accion.subscribe({
      next: () => {
        this.snackBar.open(
          `Contrato ${
            this.contrato!.id ? 'actualizado' : 'creado'
          } exitosamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.loading = false;
        this.guardado.emit();
        this.contrato = this.getNuevoContrato();
      },
      error: (err) => {
        console.log('Contrato enviado:', contratoFormateado);
        console.error('Error al guardar contrato', err);
        this.snackBar.open('Error al guardar el contrato', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  validarFormulario(): boolean {
    // Validaciones básicas del contrato
    if (!this.contrato?.clienteId) {
      this.snackBar.open('Debe seleccionar un cliente', 'Cerrar', {
        duration: 3000,
      });
      return false;
    }
    if (!this.contrato?.seguroId) {
      this.snackBar.open('Debe seleccionar un seguro', 'Cerrar', {
        duration: 3000,
      });
      return false;
    }
    if (!this.contrato?.agenteId) {
      this.snackBar.open('Debe seleccionar un agente', 'Cerrar', {
        duration: 3000,
      });
      return false;
    }
    if (!this.contrato?.fechaInicio) {
      this.snackBar.open('Debe establecer una fecha de inicio', 'Cerrar', {
        duration: 3000,
      });
      return false;
    }
    if (!this.contrato?.fechaFin) {
      this.snackBar.open('Debe establecer una fecha de fin', 'Cerrar', {
        duration: 3000,
      });
      return false;
    }

    // Asignar estado PENDIENTE por defecto
    this.contrato.estado = 'PENDIENTE';

    // Validaciones específicas según el tipo de seguro
    if (this.tipoSeguroSeleccionado === 'VIDA') {
      // Validar beneficiarios para seguro de VIDA
      if (this.contrato.beneficiarios.length === 0) {
        this.snackBar.open(
          'Debe agregar al menos un beneficiario para el seguro de VIDA',
          'Cerrar',
          { duration: 3000 }
        );
        return false;
      }

      // Validar que el porcentaje total sea exactamente 100%
      this.calcularPorcentajeTotal();
      if (this.porcentajeTotal !== 100) {
        this.snackBar.open(
          `El porcentaje total de beneficiarios debe ser exactamente 100%. Actualmente: ${this.porcentajeTotal}%`,
          'Cerrar',
          { duration: 3000 }
        );
        return false;
      }

      // Validar campos obligatorios de cada beneficiario
      for (const beneficiario of this.contrato.beneficiarios) {
        if (
          !beneficiario.nombre ||
          !beneficiario.tipoIdentificacion ||
          !beneficiario.numeroIdentificacion ||
          !beneficiario.fechaNacimiento ||
          !beneficiario.nacionalidad ||
          !beneficiario.parentesco ||
          !beneficiario.estatura ||
          !beneficiario.peso ||
          !beneficiario.lugarNacimiento ||
          beneficiario.porcentaje <= 0
        ) {
          this.snackBar.open(
            'Todos los campos de beneficiarios deben estar completos',
            'Cerrar',
            { duration: 3000 }
          );
          return false;
        }
      }
    } else if (this.tipoSeguroSeleccionado === 'SALUD') {
      // Validar dependientes para seguro de SALUD
      if (this.contrato.dependientes.length === 0) {
        this.snackBar.open(
          'Debe agregar al menos un dependiente para el seguro de SALUD',
          'Cerrar',
          { duration: 3000 }
        );
        return false;
      }

      // Validar campos obligatorios de cada dependiente
      for (const dependiente of this.contrato.dependientes) {
        if (
          !dependiente.nombre ||
          !dependiente.tipoIdentificacion ||
          !dependiente.numeroIdentificacion ||
          !dependiente.fechaNacimiento ||
          !dependiente.nacionalidad ||
          !dependiente.parentesco ||
          !dependiente.estatura ||
          !dependiente.peso ||
          !dependiente.lugarNacimiento ||
          !dependiente.hospitalCobertura
        ) {
          this.snackBar.open(
            'Todos los campos de dependientes deben estar completos',
            'Cerrar',
            { duration: 3000 }
          );
          return false;
        }

        // Validar que se haya ingresado un diagnóstico si tiene discapacidad
        if (
          dependiente.tieneDiscapacidad &&
          !dependiente.diagnosticoDiscapacidad
        ) {
          this.snackBar.open(
            'Debe ingresar el diagnóstico para dependientes con discapacidad',
            'Cerrar',
            { duration: 3000 }
          );
          return false;
        }
      }
    }

    return true;
  }

  cancelar(): void {
    this.cancelado.emit();
  }

  // validarCedulaEcuatoriana(cedula: string): boolean {
  //   if (!/^\d{10}$/.test(cedula)) return false;

  //   const provincia = parseInt(cedula.slice(0, 2), 10);
  //   const tercerDigito = parseInt(cedula[2], 10);
  //   if (!(provincia >= 1 && provincia <= 24) || tercerDigito > 6) return false;

  //   const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  //   let suma = 0;

  //   for (let i = 0; i < 9; i++) {
  //     let valor = parseInt(cedula[i]) * coeficientes[i];
  //     if (valor > 9) valor -= 9;
  //     suma += valor;
  //   }

  //   const digitoVerificador = (10 - (suma % 10)) % 10;
  //   return digitoVerificador === parseInt(cedula[9]);
  // }
}
