import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { PagoService } from '../../core/services/pago.service';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { Contrato } from '../../models/contrato.model';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
})
export class PagoComponent implements OnInit {
  pagoForm!: FormGroup;
  mensaje: string = '';
  cargando = false;

  private readonly ESTADO_POR_DEFECTO = 'COMPLETADO';

  comprobanteNombre: string | null = null;
  comprobanteBase64: string | null = null;
  comprobanteTipoContenido: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private dialogRef: MatDialogRef<PagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contrato: Contrato }
  ) {}

  ngOnInit(): void {
    this.pagoForm = this.fb.group({
      contratoId: [{ value: this.data.contrato.id, disabled: true }, Validators.required],
      metodo: ['Débito', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      referencia: [''],
      observaciones: [''],
      fechaPago: [''],
      acepto: [false, Validators.requiredTrue]    // checkbox T&C
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.comprobanteNombre = file.name;
      this.comprobanteTipoContenido = file.type;
      const reader = new FileReader();
      reader.onload = () => {
        this.comprobanteBase64 = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    } else {
      this.comprobanteNombre = this.comprobanteBase64 = this.comprobanteTipoContenido = null;
    }
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }
    this.cargando = true;

    // leer valor disabled
    this.pagoForm.get('contratoId')!.enable();
    const fv = this.pagoForm.value;
    this.pagoForm.get('contratoId')!.disable();

    const payload = {
      contratoId: fv.contratoId,
      monto: fv.monto,
      metodo: this.transformarMetodoPago(fv.metodo),
      referencia: fv.referencia,
      observaciones: fv.observaciones,
      estado: this.ESTADO_POR_DEFECTO,
      fechaPago: fv.fechaPago ? new Date(fv.fechaPago).toISOString() : null,
      comprobante: this.comprobanteBase64,
      comprobanteNombre: this.comprobanteNombre,
      comprobanteTipoContenido: this.comprobanteTipoContenido,
    };

    this.pagoService.crearPago(payload).subscribe({
      next: () => this.dialogRef.close('pagado'),
      error: err => {
        console.error('Error al registrar pago:', err);
        this.mensaje = err.error?.message || 'Error al registrar el pago';
        this.cargando = false;
      }
    });
  }

  private transformarMetodoPago(m: string): string {
    const mapping: Record<string,string> = {
      'Débito': 'DEBITO_AUTOMATICO',
      'Transferencia': 'TRANSFERENCIA',
      'Efectivo': 'EFECTIVO',
      'Tarjeta': 'TARJETA'
    };
    return mapping[m] || m;
  }
}
