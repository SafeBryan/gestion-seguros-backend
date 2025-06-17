import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-reembolso-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeUrlPipe,
  ],
  templateUrl: './reembolso-detalle-dialog.component.html',
})
export class ReembolsoDetalleDialogComponent {
  comentario = '';
  archivoUrlCompleta: string = '';
  nombreArchivo: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReembolsoDetalleDialogComponent>,
    private reembolsoService: ReembolsoService
  ) {
    const archivos = data.archivos ?? {};

    // Extraer el primer archivo del Map (nombre visible y ruta real)
    const firstFileKey = Object.keys(archivos)[0];
    const relativePath = archivos[firstFileKey];

    this.nombreArchivo = firstFileKey;
    this.archivoUrlCompleta = relativePath
      ? `http://localhost:8080/${relativePath.replace(/\\/g, '/')}`
      : '';
  }

  aprobar(): void {
    this.procesar(true);
  }

  rechazar(): void {
    if (!this.comentario.trim()) {
      alert('Debe ingresar un comentario al rechazar');
      return;
    }
    this.procesar(false);
  }

  procesar(aprobado: boolean): void {
    this.reembolsoService
      .procesarReembolso(this.data.id, aprobado, this.comentario)
      .subscribe({
        next: () => {
          this.dialogRef.close({
            realizado: true,
            tipo: aprobado ? 'aprobado' : 'rechazado',
          });
        },
        error: () => alert('Error al procesar reembolso'),
      });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
