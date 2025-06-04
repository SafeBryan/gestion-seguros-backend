import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PagoService } from '../../core/services/pago.service';
import { PagoRequestDTO } from '../../models/pago-request.dto';
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
      comprobante: [''],
      observaciones: [''],
    });
  }

  onSubmit(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const nuevoPago: PagoRequestDTO = this.pagoForm.value;

    this.pagoService.crearPago(nuevoPago).subscribe({
      next: (res) => {
        this.mensaje = 'Pago registrado exitosamente.';
        this.pagoForm.reset();
        this.cargando = false;
      },
      error: (err) => {
        this.mensaje = 'Ocurrió un error al registrar el pago.';
        console.error(err);
        this.cargando = false;
      }
    });
  }
}
