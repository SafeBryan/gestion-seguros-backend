import { Component } from '@angular/core';
import { Contrato } from '../../../models/contrato.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContratosFormComponent } from '../contratos-form/contratos-form.component';
import { ContratosListComponent } from '../contratos-list/contratos-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'app-contratos-page',
  templateUrl: './contratos-page.component.html',
  styleUrls: ['./contratos-page.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ContratosFormComponent,
    ContratosListComponent,
  ],
})
export class ContratosPageComponent {
  mostrarFormulario = false;
  contratoAEditar?: Contrato;

  nuevoContrato() {
    this.contratoAEditar = undefined;
    this.mostrarFormulario = true;
  }

  editarContrato(contrato: Contrato) {
    this.contratoAEditar = contrato;
    this.mostrarFormulario = true;
  }

  alGuardar() {
    this.mostrarFormulario = false;
  }
  cancelarFormulario(): void {
    this.mostrarFormulario = false;
  }
}
