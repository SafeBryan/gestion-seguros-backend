import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosListComponent } from './contratos-list.component';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Contrato } from '../../../models/contrato.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContratosListComponent', () => {
  let component: ContratosListComponent;
  let fixture: ComponentFixture<ContratosListComponent>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const contratosMock: Contrato[] = [
    {
      id: 1,
      clienteId: 10,
      seguroId: 2,
      agenteId: 5,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      beneficiarios: [],
    },
  ];

  beforeEach(async () => {
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', [
      'obtenerPorCliente',
      'actualizarEstado',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioId']);

    await TestBed.configureTestingModule({
      imports: [ContratosListComponent,HttpClientTestingModule  ],
      providers: [
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosListComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos en ngOnInit', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10);
    contratoServiceSpy.obtenerPorCliente.and.returnValue(of(contratosMock));

    fixture.detectChanges();

    expect(component.contratos.length).toBe(1);
    expect(component.contratos[0].id).toBe(1);
  });

  it('debería manejar error al cargar contratos', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10);
    spyOn(console, 'error');
    contratoServiceSpy.obtenerPorCliente.and.returnValue(
      throwError(() => new Error('Error al obtener'))
    );

    component.cargarContratos();

    expect(console.error).toHaveBeenCalledWith(
      'Error al cargar contratos',
      jasmine.any(Error)
    );
  });

  it('debería desactivar contrato y recargar', () => {
    spyOn(window, 'alert');
    spyOn(component, 'cargarContratos');

    contratoServiceSpy.actualizarEstado.and.returnValue(
      of({
        id: 1,
        clienteId: 10,
        seguroId: 2,
        agenteId: 5,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        frecuenciaPago: 'MENSUAL',
        estado: 'CANCELADO',
        firmaElectronica: '',
        beneficiarios: [],
      })
    );

    component.desactivarContrato(1);

    expect(contratoServiceSpy.actualizarEstado).toHaveBeenCalledWith(
      1,
      'CANCELADO'
    );
    expect(window.alert).toHaveBeenCalledWith('Contrato desactivado');
    expect(component.cargarContratos).toHaveBeenCalled();
  });

  it('debería manejar error al desactivar contrato', () => {
    spyOn(console, 'error');
    contratoServiceSpy.actualizarEstado.and.returnValue(
      throwError(() => new Error('Falló la cancelación'))
    );

    component.desactivarContrato(2);

    expect(console.error).toHaveBeenCalledWith(
      'Error al desactivar contrato',
      jasmine.any(Error)
    );
  });

  it('debería emitir evento al editar contrato', () => {
    const contrato: Contrato = contratosMock[0];
    spyOn(component.editar, 'emit');

    component.editarContrato(contrato);

    expect(component.editar.emit).toHaveBeenCalledWith(contrato);
  });
});
