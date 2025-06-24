import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { Contrato } from '../../models/contrato.model';
import { ClienteResponseDTO } from '../../models/cliente-response.dto';
import { PagoResponseDTO } from '../../models/pago-response.dto';
import { ContratoService } from '../../core/services/contrato.service';
import { ClienteService } from '../../core/services/cliente.service';
import { PagoService } from '../../core/services/pago.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../../shared/preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-contracts-clients-payments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './contract-client-payments.component.html',
  styleUrls: ['./contract-client-payments.component.css'],
})
export class ContractsClientsPaymentsComponent implements OnInit {
  data: Array<{
    contrato: Contrato;
    cliente: ClienteResponseDTO;
    pagos: PagoResponseDTO[];
  }> = [];

  loading = false;

  // Columnas de las tablas
  contratoCols = ['id', 'seguro', 'cliente', 'inicio', 'fin', 'estado'];
  pagoCols = ['id', 'fechaPago', 'metodo', 'monto', 'estado', 'archivo'];

  constructor(
    private contratoSvc: ContratoService,
    private clienteSvc: ClienteService,
    private pagoSvc: PagoService,
    private dialog: MatDialog,
    private pagoService: PagoService,
  ) { }


  ngOnInit(): void {
    this.loading = true;
    this.contratoSvc.obtenerTodosLosContratos().pipe(
      switchMap(contratos => {
        if (!contratos.length) return of([]);
        const tasks = contratos.map(c => {
          const cliente$ = this.clienteSvc.obtenerCliente(c.clienteId)
            .pipe(catchError(() => of({ id: c.clienteId, nombre: '(no encontrado)' } as ClienteResponseDTO)));
          const pagos$ = this.pagoSvc.listarPagosPorContrato(c.id!)
            .pipe(catchError(() => of([] as PagoResponseDTO[])));
          return forkJoin({ contrato: of(c), cliente: cliente$, pagos: pagos$ });
        });
        return forkJoin(tasks);
      })
    ).subscribe({
      next: arr => { this.data = arr; this.loading = false; },
      error: _ => { this.data = []; this.loading = false; }
    });
  }

  verComprobante(p: PagoResponseDTO) {
    if (!p.comprobante) { return; }
    this.dialog.open(PreviewDialogComponent, {
      data: {
        content: p.comprobante,
        contentType: p.comprobanteTipoContenido
      },
      panelClass: 'preview-dialog-panel',
      width: '80vw',
      height: '90vh',
      maxWidth: '95vw',
      maxHeight: '95vh'
    });
  }


}
