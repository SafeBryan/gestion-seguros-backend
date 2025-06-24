import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PagoService } from '../../core/services/pago.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class PagoComponent implements OnInit {
  pagoForm!: FormGroup;
  mensaje: string = '';
  cargando = false;

  estadosDisponibles = ['COMPLETADO', 'REVERTIDO']; 

  comprobanteNombre: string | null = null;
  comprobanteBase64: string | null = null;
  comprobanteTipoContenido: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      contratoId: [null, [Validators.required]],
      metodo: ['Débito', [Validators.required]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      referencia: [''],
      observaciones: [''],
      estado: ['COMPLETADO'],
      fechaPago: [''],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.comprobanteNombre = file.name;
      this.comprobanteTipoContenido = file.type;

      const reader = new FileReader();
      reader.onload = () => {
        // reader.result es string tipo data:<tipo>;base64,<datos>
        const base64String = (reader.result as string).split(',')[1];
        this.comprobanteBase64 = base64String;
      };
      reader.readAsDataURL(file);
    } else {
      this.comprobanteNombre = null;
      this.comprobanteBase64 = null;
      this.comprobanteTipoContenido = null;
    }
  }

onSubmit(): void {
  if (this.pagoForm.invalid) {
    this.pagoForm.markAllAsTouched();
    return;
  }

  this.cargando = true;

  const formValue = this.pagoForm.value;
  const payload = {
    contratoId: formValue.contratoId,
    monto: formValue.monto,
    metodo: this.transformarMetodoPago(formValue.metodo),
    referencia: formValue.referencia, // Incluir referencia
    observaciones: formValue.observaciones,
    estado: formValue.estado,
    fechaPago: formValue.fechaPago ? new Date(formValue.fechaPago).toISOString() : null,
    comprobante: this.comprobanteBase64, // Nombre exacto que espera el backend
    comprobanteNombre: this.comprobanteNombre,
    comprobanteTipoContenido: this.comprobanteTipoContenido
  };

  this.pagoService.crearPago(payload).subscribe({
    next: () => {
      this.mensaje = 'Pago registrado exitosamente';
      this.resetForm();
    },
    error: (err) => {
      console.error('Error al registrar pago:', err);
      this.mensaje = err.error?.message || 'Error al registrar el pago';
      this.cargando = false;
    }
  });
}

private transformarMetodoPago(metodoFrontend: string): string {
  const mapping: {[key: string]: string} = {
    'Débito': 'DEBITO_AUTOMATICO',
    'Transferencia': 'TRANSFERENCIA',
    'Efectivo': 'EFECTIVO',
    'Tarjeta': 'TARJETA'
  };
  return mapping[metodoFrontend] || metodoFrontend;
}

private resetForm(): void {
  this.pagoForm.reset({
    metodo: 'Débito',
    estado: 'COMPLETADO'
  });
  this.comprobanteNombre = null;
  this.comprobanteBase64 = null;
  this.comprobanteTipoContenido = null;
  this.cargando = false;
}}