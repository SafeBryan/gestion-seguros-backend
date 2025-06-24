import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReembolsoService } from '../../../core/services/reembolso.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reembolso-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './reembolso-crear.component.html',
  styleUrls: ['./reembolso-crear.component.css'],
})
export class ReembolsoCrearComponent implements OnInit {
  form: FormGroup;
  contratos: any[] = [];
  archivoSeleccionado: File | null = null;
  loading = false;
  loadingContratos = true;
  enviandoSolicitud = false;

  get esAccidente(): boolean {
    return this.form.get('esAccidente')?.value;
  }
  
  get esAccidenteControl(): FormControl {
    return this.form.get('esAccidente') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private reembolsoService: ReembolsoService,
    private contratoService: ContratoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      contratoId: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      monto: ['', [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      nombreMedico: ['', Validators.required],
      motivoConsulta: ['', Validators.required],
      cie10: [''],
      fechaAtencion: ['', Validators.required],
      inicioSintomas: [''],
      esAccidente: [false],
      detalleAccidente: [''],
    });

    // Validador condicional para detalle del accidente
    this.form.get('esAccidente')?.valueChanges.subscribe(esAccidente => {
      const detalleControl = this.form.get('detalleAccidente');
      if (esAccidente) {
        detalleControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        detalleControl?.clearValidators();
      }
      detalleControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    const clienteId = this.authService.getUsuarioId();
    if (!clienteId) {
      this.mostrarNotificacion('Error: Usuario no identificado', 'error');
      this.loadingContratos = false;
      return;
    }

    this.contratoService.obtenerPorCliente(clienteId).subscribe({
      next: (data) => {
        this.contratos = data;
        this.loadingContratos = false;
        if (data.length === 0) {
          this.mostrarNotificacion('No tienes contratos activos disponibles', 'info');
        }
      },
      error: (err) => {
        console.error('Error al cargar contratos:', err);
        this.loadingContratos = false;
        this.mostrarNotificacion('Error al cargar contratos', 'error');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validaciones del archivo
      if (file.type !== 'application/pdf') {
        this.mostrarNotificacion('Solo se permiten archivos PDF', 'error');
        input.value = '';
        this.archivoSeleccionado = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.mostrarNotificacion('El archivo no debe superar 5MB', 'error');
        input.value = '';
        this.archivoSeleccionado = null;
        return;
      }

      this.archivoSeleccionado = file;
      this.mostrarNotificacion(`Archivo "${file.name}" seleccionado correctamente`, 'success');
    }
  }

  limpiarFormulario(): void {
    this.form.reset({
      contratoId: '',
      descripcion: '',
      monto: '',
      nombreMedico: '',
      motivoConsulta: '',
      cie10: '',
      fechaAtencion: '',
      inicioSintomas: '',
      esAccidente: false,
      detalleAccidente: '',
    });
    this.archivoSeleccionado = null;
    
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  enviar(): void {
    if (this.form.invalid) {
      this.marcarCamposComoTocados();
      this.mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const clienteId = this.authService.getUsuarioPerfil()?.id;
    if (!clienteId || !this.archivoSeleccionado) {
      this.mostrarNotificacion('Falta seleccionar archivo o cliente inválido', 'error');
      return;
    }

    this.enviandoSolicitud = true;

    const datos = {
      contratoId: this.form.value.contratoId,
      descripcion: this.form.value.descripcion.trim(),
      monto: parseFloat(this.form.value.monto),
      nombreMedico: this.form.value.nombreMedico.trim(),
      motivoConsulta: this.form.value.motivoConsulta.trim(),
      cie10: this.form.value.cie10?.trim() || '',
      fechaAtencion: this.form.value.fechaAtencion,
      inicioSintomas: this.form.value.inicioSintomas,
      esAccidente: this.form.value.esAccidente,
      detalleAccidente: this.form.value.detalleAccidente?.trim() || '',
    };

    const formData = new FormData();
    formData.append(
      'datos',
      new Blob([JSON.stringify(datos)], { type: 'application/json' })
    );
    formData.append('archivos', this.archivoSeleccionado);

    this.reembolsoService.crearReembolsoConArchivos(formData).subscribe({
      next: (response) => {
        this.enviandoSolicitud = false;
        this.mostrarNotificacion('Solicitud de reembolso enviada exitosamente', 'success');
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al enviar solicitud:', err);
        this.enviandoSolicitud = false;
        this.mostrarNotificacion('Error al enviar la solicitud de reembolso', 'error');
      }
    });
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return `Este campo es requerido`;
    }
    if (field?.hasError('min')) {
      return `El valor mínimo es ${field.errors?.['min']?.min}`;
    }
    if (field?.hasError('max')) {
      return `El valor máximo es ${field.errors?.['max']?.max}`;
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength']?.requiredLength} caracteres`;
    }
    return '';
  }

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: tipo === 'error' ? 5000 : 3000,
      panelClass: [
        tipo === 'error' ? 'error-snackbar' : 
        tipo === 'success' ? 'success-snackbar' : 'info-snackbar'
      ],
    });
  }

  get puedeEnviar(): boolean {
    return this.form.valid && this.archivoSeleccionado !== null && !this.enviandoSolicitud;
  }
}