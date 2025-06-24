import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';
import { ReembolsoResponse,  } from '../../../models/reembolso-response.model';
import { EstadoReembolso } from '../../../models/reembolso-estado.enum';

@Component({
  selector: 'app-reembolso-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SafeUrlPipe,
  ],
  templateUrl: './reembolso-detalle-dialog.component.html',
  styleUrls: ['./reembolso-detalle-dialog.component.css']
})
export class ReembolsoDetalleDialogComponent {
  comentario = '';
  archivoUrlCompleta: string = '';
  nombreArchivo: string = '';
  procesando = false;
  mostrarCampoRequerido = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReembolsoResponse,
    private dialogRef: MatDialogRef<ReembolsoDetalleDialogComponent>,
    private reembolsoService: ReembolsoService
  ) {
    this.initializeArchivo();
  }

  private initializeArchivo(): void {
    const archivos = this.data.archivos ?? {};
    const firstFileKey = Object.keys(archivos)[0];
    const relativePath = archivos[firstFileKey];

    this.nombreArchivo = firstFileKey || 'Documento';
    this.archivoUrlCompleta = relativePath
      ? `http://localhost:8080/${relativePath.replace(/\\/g, '/')}`
      : '';
  }

  /**
   * Obtiene la clase CSS según el estado del reembolso
   */
  getEstadoClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case EstadoReembolso.PENDIENTE:
        return 'pendiente';
      case EstadoReembolso.APROBADO:
        return 'aprobado';
      case EstadoReembolso.RECHAZADO:
        return 'rechazado';
      default:
        return 'pendiente';
    }
  }

  /**
   * Obtiene el icono según el estado del reembolso
   */
  getEstadoIcon(estado: string): string {
    switch (estado?.toUpperCase()) {
      case EstadoReembolso.PENDIENTE:
        return 'schedule';
      case EstadoReembolso.APROBADO:
        return 'check_circle';
      case EstadoReembolso.RECHAZADO:
        return 'cancel';
      default:
        return 'schedule';
    }
  }

  /**
   * Abre el archivo en una nueva pestaña
   */
  abrirArchivo(): void {
    if (this.archivoUrlCompleta) {
      window.open(this.archivoUrlCompleta, '_blank');
    }
  }

  /**
   * Descarga el archivo
   */
  descargarArchivo(): void {
    if (this.archivoUrlCompleta) {
      const link = document.createElement('a');
      link.href = this.archivoUrlCompleta;
      link.download = this.nombreArchivo;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Aprueba el reembolso
   */
  aprobar(): void {
    this.mostrarCampoRequerido = false;
    this.procesar(true);
  }

  /**
   * Rechaza el reembolso
   */
  rechazar(): void {
    if (!this.comentario.trim()) {
      this.mostrarCampoRequerido = true;
      this.mostrarError('Debe ingresar un comentario al rechazar la solicitud');
      return;
    }
    this.mostrarCampoRequerido = false;
    this.procesar(false);
  }

  /**
   * Procesa la aprobación o rechazo del reembolso
   */
  private procesar(aprobado: boolean): void {
    this.procesando = true;
    
    this.reembolsoService
      .procesarReembolso(this.data.id, aprobado, this.comentario)
      .subscribe({
        next: () => {
          this.procesando = false;
          const tipoAccion = aprobado ? 'aprobado' : 'rechazado';
          this.mostrarExito(`Reembolso ${tipoAccion} exitosamente`);
          
          this.dialogRef.close({
            realizado: true,
            tipo: tipoAccion,
            comentario: this.comentario
          });
        },
        error: (error) => {
          this.procesando = false;
          console.error('Error al procesar reembolso:', error);
          this.mostrarError(`Error al ${aprobado ? 'aprobar' : 'rechazar'} el reembolso. Intente nuevamente.`);
        }
      });
  }

  /**
   * Cierra el diálogo sin realizar acciones
   */
  cerrar(): void {
    this.dialogRef.close();
  }

  /**
   * Muestra un mensaje de error (puedes reemplazar con tu sistema de notificaciones)
   */
  private mostrarError(mensaje: string): void {
    // Aquí puedes integrar tu sistema de notificaciones (SnackBar, Toast, etc.)
    alert(mensaje);
  }

  /**
   * Muestra un mensaje de éxito (puedes reemplazar con tu sistema de notificaciones)
   */
  private mostrarExito(mensaje: string): void {
    // Aquí puedes integrar tu sistema de notificaciones (SnackBar, Toast, etc.)
    console.log(mensaje);
  }

  /**
   * Verifica si el reembolso puede ser procesado
   */
  get puedeSerProcesado(): boolean {
    return this.data.estado?.toUpperCase() === EstadoReembolso.PENDIENTE;
  }
}