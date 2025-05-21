import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ContratosListComponent } from './contratos-list.component';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Contrato } from '../../../models/contrato.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContratosPageComponent } from '../contratos-page/contratos-page.component';

describe('ContratosListComponent', () => {
  let component: ContratosListComponent;
  let fixture: ComponentFixture<ContratosListComponent>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockContrato: Contrato = {
    id: 1,
    clienteId: 10,
    seguroId: 2,
    agenteId: 5,
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31',
    frecuenciaPago: 'MENSUAL',
    estado: 'ACTIVO',
    beneficiarios: [],
  };

  beforeEach(async () => {
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', [
      'obtenerPorCliente',
      'actualizarEstado',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioId']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContratosPageComponent, MatDialogModule],
      providers: [
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosListComponent);
    component = fixture.componentInstance;

    // Evita fallos en ngOnInit
    contratoServiceSpy.obtenerPorCliente.and.returnValue(of([]));
    authServiceSpy.getUsuarioId.and.returnValue(1);
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos en ngOnInit', () => {
    contratoServiceSpy.obtenerPorCliente.and.returnValue(of([mockContrato]));

    fixture.detectChanges();

    expect(component.contratos.length).toBe(1);
    expect(component.contratos[0].id).toEqual(1);
  });

  it('no debería cancelar contrato si usuario cancela confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.desactivarContrato(mockContrato);
    expect(contratoServiceSpy.actualizarEstado).not.toHaveBeenCalled();
  });

  it('debería emitir el evento al editar contrato', () => {
    spyOn(component.editar, 'emit');
    component.editarContrato(mockContrato);
    expect(component.editar.emit).toHaveBeenCalledWith(mockContrato);
  });

  it('debería devolver color correcto según estado', () => {
    expect(component.getEstadoColor('ACTIVO')).toBe('primary');
    expect(component.getEstadoColor('PENDIENTE')).toBe('accent');
    expect(component.getEstadoColor('CANCELADO')).toBe('warn');
    expect(component.getEstadoColor('OTRO')).toBe('');
  });

  it('debería devolver texto correcto según frecuencia de pago', () => {
    expect(component.getFrecuenciaPagoTexto('MENSUAL')).toBe('Mensual');
    expect(component.getFrecuenciaPagoTexto('TRIMESTRAL')).toBe('Trimestral');
    expect(component.getFrecuenciaPagoTexto('SEMESTRAL')).toBe('Semestral');
    expect(component.getFrecuenciaPagoTexto('ANUAL')).toBe('Anual');
    expect(component.getFrecuenciaPagoTexto('OTRO')).toBe('OTRO');
  });

  it('debería formatear fecha correctamente', () => {
    expect(component.formatearFecha('2024-05-21')).toMatch(
      /^\d{2}\/\d{2}\/\d{4}$/
    );
    expect(component.formatearFecha('')).toBe('');
  });
});
