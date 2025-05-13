import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosPageComponent } from './contratos-page.component';
import { ContratosFormComponent } from '../contratos-form/contratos-form.component';
import { ContratosListComponent } from '../contratos-list/contratos-list.component';
import { Contrato } from '../../../models/contrato.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

describe('ContratosPageComponent', () => {
  let component: ContratosPageComponent;
  let fixture: ComponentFixture<ContratosPageComponent>;

  beforeEach(async () => {
    const contratoServiceSpy = jasmine.createSpyObj('ContratoService', [
      'obtenerPorCliente',
      'actualizarEstado',
    ]);
    contratoServiceSpy.obtenerPorCliente.and.returnValue(of([]));
    contratoServiceSpy.actualizarEstado.and.returnValue(of({}));

    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUsuarioId',
      'getAuthHeaders',
    ]);
    authServiceSpy.getUsuarioId.and.returnValue(1);
    authServiceSpy.getAuthHeaders.and.returnValue(new HttpHeaders());

    await TestBed.configureTestingModule({
      imports: [
        ContratosPageComponent,
        ContratosFormComponent,
        ContratosListComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // aún útil para otros elementos no declarados
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería activar el formulario para nuevo contrato', () => {
    component.nuevoContrato();
    expect(component.mostrarFormulario).toBeTrue();
    expect(component.contratoAEditar).toBeUndefined();
  });

  it('debería activar el formulario para editar contrato', () => {
    const contratoMock: Contrato = {
      clienteId: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      beneficiarios: [],
    };

    component.editarContrato(contratoMock);
    expect(component.mostrarFormulario).toBeTrue();
    expect(component.contratoAEditar).toEqual(contratoMock);
  });

  it('debería ocultar formulario al guardar', () => {
    component.mostrarFormulario = true;
    component.alGuardar();
    expect(component.mostrarFormulario).toBeFalse();
  });

  it('debería ocultar formulario al cancelar', () => {
    component.mostrarFormulario = true;
    component.cancelarFormulario();
    expect(component.mostrarFormulario).toBeFalse();
  });
});
