import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
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
  ],
  templateUrl: './reembolso-crear.component.html',
  styleUrls: ['./reembolso-crear.component.css'],
})
export class ReembolsoCrearComponent implements OnInit {
  form: FormGroup;
  contratos: any[] = [];
  archivoSeleccionado: File | null = null;

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

    const formData = new FormData();
    formData.append('clienteId', clienteId.toString());
    formData.append('contratoId', this.form.value.contratoId);
    formData.append('descripcion', this.form.value.descripcion);
    formData.append('monto', this.form.value.monto);
    formData.append('archivo', this.archivoSeleccionado);

    this.reembolsoService.crearReembolso(formData).subscribe({
      next: () =>
        this.snackBar.open('Reembolso enviado', 'Cerrar', { duration: 3000 }),
      error: () => this.snackBar.open('Error al enviar solicitud', 'Cerrar'),
    });
  }
}
