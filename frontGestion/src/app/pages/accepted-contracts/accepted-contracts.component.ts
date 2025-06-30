import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';             
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';       

import { Contrato, EstadoContrato } from '../../models/contrato.model';
import { ContratoService } from '../../core/services/contrato.service';
import { AuthService } from '../../services/auth.service';
import { PagoComponent } from '../pago/pago.component';

@Component({
  selector: 'app-accepted-contracts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,             
    MatDividerModule,          
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './accepted-contracts.component.html',
  styleUrls: ['./accepted-contracts.component.css'],
})
export class AcceptedContractsComponent implements OnInit {
  contratos: Contrato[] = [];
  loading = false;
  readonly ESTADO_OK: EstadoContrato = 'ACEPTADO';
  displayedColumns = ['id', 'seguro', 'inicio', 'fin', 'accion'];

  constructor(
    private contratoService: ContratoService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAceptados();
  }

private loadAceptados(): void {
  this.loading = true;
  const clienteId = this.auth.getUsuarioId();
  this.contratoService.obtenerAceptadosPorCliente(clienteId)
    .subscribe({
      next: lista => {
        console.log('🔥 GET /api/contratos/cliente/'+clienteId+'/aceptados →', lista);
        this.contratos = lista;
        this.loading = false;
      },
      error: err => {
        console.error('💣 Error al cargar aceptados:', err);
        this.loading = false;
      },
    });
}


  abrirPagarModal(contrato: Contrato): void {
    const ref = this.dialog.open(PagoComponent, {
      width: '400px',
      data: { contrato },
    });
    ref.afterClosed().subscribe((res: string) => {
      if (res === 'pagado') {
        this.loadAceptados();
      }
    });
  }
}
