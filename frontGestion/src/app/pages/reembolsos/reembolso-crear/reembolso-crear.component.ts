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

import { ReembolsoService } from '../../../core/services/reembolso.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
  ],
  templateUrl: './reembolso-crear.component.html',
  styleUrls: ['./reembolso-crear.component.css'],
})
export class ReembolsoCrearComponent implements OnInit {
  form: FormGroup;
  contratos: any[] = [];
  archivoSeleccionado: File | null = null;

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
      descripcion: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0.01)]],
      nombreMedico: [''],
      motivoConsulta: [''],
      cie10: [''],
      fechaAtencion: [''],
      inicioSintomas: [''],
      esAccidente: [false],
      detalleAccidente: [''],
    });
  }

  ngOnInit(): void {
    const clienteId = this.authService.getUsuarioId();
    this.contratoService.obtenerPorCliente(clienteId!).subscribe({
      next: (data) => (this.contratos = data),
      error: () => this.snackBar.open('Error al cargar contratos', 'Cerrar'),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  enviar(): void {
    const clienteId = this.authService.getUsuarioPerfil()?.id;
    if (!clienteId || !this.archivoSeleccionado) {
      this.snackBar.open('Falta archivo o cliente inválido', 'Cerrar');
      return;
    }

    const datos = {
      contratoId: this.form.value.contratoId,
      descripcion: this.form.value.descripcion,
      monto: this.form.value.monto,
      nombreMedico: this.form.value.nombreMedico,
      motivoConsulta: this.form.value.motivoConsulta,
      cie10: this.form.value.cie10,
      fechaAtencion: this.form.value.fechaAtencion,
      inicioSintomas: this.form.value.inicioSintomas,
      esAccidente: this.form.value.esAccidente,
      detalleAccidente: this.form.value.detalleAccidente,
    };

    const formData = new FormData();
    formData.append(
      'datos',
      new Blob([JSON.stringify(datos)], { type: 'application/json' })
    );
    formData.append('archivos', this.archivoSeleccionado);

    this.reembolsoService.crearReembolsoConArchivos(formData).subscribe({
      next: () =>
        this.snackBar.open('Reembolso enviado', 'Cerrar', { duration: 3000 }),
      error: () => this.snackBar.open('Error al enviar solicitud', 'Cerrar'),
    });
  }
}
