import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReembolsoResponse } from '../../../models/reembolso-response.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReembolsoDetalleDialogComponent } from '../reembolso-detalle-dialog/reembolso-detalle-dialog.component';

@Component({
  selector: 'app-reembolsos-pendientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './reembolsos-pendientes.component.html',
  styleUrls: ['./reembolsos-pendientes.component.css'],
})
export class ReembolsosPendientesComponent implements OnInit {
  displayedColumns: string[] = [
    'cliente',
    'contrato',
    'monto',
    'estado',
    'acciones',
  ];
  reembolsos: ReembolsoResponse[] = [];

  constructor(
    private reembolsoService: ReembolsoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reembolsoService.obtenerPendientes().subscribe({
      next: (data) => (this.reembolsos = data),
      error: () =>
        this.snackBar.open('Error al cargar reembolsos pendientes', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  abrirDetalle(reembolso: ReembolsoResponse): void {
    const dialogRef = this.dialog.open(ReembolsoDetalleDialogComponent, {
      width: '500px',
      data: reembolso,
    });

    dialogRef.afterClosed().subscribe((accion) => {
      if (accion?.realizado) {
        this.reembolsos = this.reembolsos.filter((r) => r.id !== reembolso.id);
        this.snackBar.open(`Reembolso ${accion.tipo}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
