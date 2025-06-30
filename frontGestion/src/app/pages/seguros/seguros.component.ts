import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SeguroService } from '../../core/services/seguro.service';
import { Seguro } from '../../models/seguro.model';
import { AuthService } from '../../services/auth.service';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-seguros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTabsModule,
    MatBadgeModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css'],
})
export class SegurosComponent implements OnInit {
  /*mostrarModal(mostrarModal: any) {
    throw new Error('Method not implemented.');
  }*/
  seguros: Seguro[] = [];
  segurosActivos: Seguro[] = [];
  segurosInactivos: Seguro[] = [];
  loading = true;
  editMode = false;
  vidaCoberturas = [
    'Fallecimiento Natural',
    'Fallecimiento Accidental',
    'Invalidez Permanente',
    'Enfermedad Terminal',
    'Asistencia Funeraria',
  ];

  seguroForm!: FormGroup;
  dialogRef: MatDialogRef<any> | null = null;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  nuevoSeguro: any;

  constructor(
    private seguroService: SeguroService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarSeguros();
  }

  initForm(): void {
    this.seguroForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['VIDA', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      cobertura: [[], Validators.required], // ← array ahora
      precioAnual: [0, [Validators.required, Validators.min(1)]],
      activo: [true, Validators.required],
      montoCobertura: [0],
      numeroConsultasIncluidas: [0],
    });
  }

  getCoberturasDisponibles(): string[] {
    const tipo = this.seguroForm?.get('tipo')?.value;

    if (tipo === 'VIDA') {
      return [
        'Fallecimiento Natural',
        'Fallecimiento Accidental',
        'Invalidez Permanente',
        'Enfermedad Terminal',
        'Asistencia Funeraria',
      ];
    } else if (tipo === 'SALUD') {
      return [
        'Hospitalización',
        'Consultas médicas',
        'Cirugías',
        'Medicamentos',
        'Exámenes de laboratorio',
      ];
    }

    return [];
  }

  cargarSeguros(): void {
    this.loading = true;
    this.seguroService.obtenerTodosLosSeguros().subscribe({
      next: (data) => {
        this.seguros = data;
        this.segurosActivos = data.filter((s) => s.activo);
        this.segurosInactivos = data.filter((s) => !s.activo);
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

  trackBySeguroId(_: number, seguro: Seguro): number {
    return seguro.id;
  }

  crearSeguro(): void {
    this.editMode = false;
    this.seguroForm.reset({
      tipo: 'VIDA',
      activo: true,
      precioAnual: 0,
      montoCobertura: 0,
      numeroConsultasIncluidas: 0,
    });
    this.abrirModal();
  }

  abrirModal(): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '700px',
      disableClose: true,
    });
  }

  cerrarModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
    this.seguroForm.reset();
  }

  guardarSeguro(): void {
    if (this.seguroForm.invalid) {
      this.snackBar.open(
        'Por favor complete todos los campos requeridos',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    const formData = {
      ...this.seguroForm.value,
      cobertura: this.seguroForm.value.cobertura.join(', '),
    };
    const usuarioId = this.authService.getUsuarioId();

    const seguroData: Seguro = {
      ...formData,
      creadoPorId: usuarioId,
    };

    if (this.editMode && formData.id) {
      this.seguroService.editarSeguro(formData.id, seguroData).subscribe({
        next: () => {
          this.snackBar.open('Seguro actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.cargarSeguros();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al editar el seguro', err);
          this.snackBar.open('Error al editar el seguro', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    } else {
      this.seguroService.crearSeguro(seguroData).subscribe({
        next: () => {
          this.snackBar.open('Seguro creado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.cargarSeguros();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al guardar el seguro', err);
          this.snackBar.open('Error al crear el seguro', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  editarSeguro(seguro: Seguro): void {
    this.editMode = true;
    this.seguroForm.patchValue({
      id: seguro.id,
      nombre: seguro.nombre,
      tipo: seguro.tipo,
      descripcion: seguro.descripcion,
      cobertura: seguro.cobertura?.split(',').map((item) => item.trim()) || [],
      precioAnual: seguro.precioAnual,
      activo: seguro.activo,
      montoCobertura: seguro.montoCobertura || 0,
      numeroConsultasIncluidas: seguro.numeroConsultasIncluidas || 0,
    });
    this.abrirModal();
  }

  eliminarSeguro(seguro: Seguro): void {
    if (
      confirm(`¿Está seguro que desea desactivar el seguro "${seguro.nombre}"?`)
    ) {
      this.seguroService.actualizarEstado(seguro.id, false).subscribe({
        next: () => {
          this.snackBar.open('Seguro desactivado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.cargarSeguros();
        },
        error: (err) => {
          console.error('Error al desactivar el seguro', err);
          this.snackBar.open('Error al desactivar el seguro', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  activarSeguro(seguro: Seguro): void {
    this.seguroService.actualizarEstado(seguro.id, true).subscribe({
      next: () => {
        this.snackBar.open('Seguro activado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.cargarSeguros();
      },
      error: (err) => {
        console.error('Error al activar el seguro', err);
        this.snackBar.open('Error al activar el seguro', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  // Getters para validaciones del formulario
  get nombre() {
    return this.seguroForm.get('nombre');
  }
  get tipo() {
    return this.seguroForm.get('tipo');
  }
  get descripcion() {
    return this.seguroForm.get('descripcion');
  }
  get cobertura() {
    return this.seguroForm.get('cobertura');
  }
  get precioAnual() {
    return this.seguroForm.get('precioAnual');
  }

  // Método para obtener el color del chip según el tipo
  getTipoColor(tipo: string): string {
    return tipo === 'VIDA' ? 'primary' : 'accent';
  }

  // Método para formatear precio
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(precio);
  }
}
