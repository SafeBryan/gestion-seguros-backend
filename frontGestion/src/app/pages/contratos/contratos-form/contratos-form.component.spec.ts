import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratosFormComponent } from './contratos-form.component';
import { SeguroService } from '../../../core/services/seguro.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Contrato } from '../../../models/contrato.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('ContratosFormComponent', () => {
  let component: ContratosFormComponent;
  let fixture: ComponentFixture<ContratosFormComponent>;
  let seguroServiceSpy: jasmine.SpyObj<SeguroService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    seguroServiceSpy = jasmine.createSpyObj('SeguroService', [
      'obtenerSegurosActivos',
    ]);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
      'obtenerPorRol',
    ]);
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', [
      'crearContrato',
      'actualizarContrato',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioId']);

    await TestBed.configureTestingModule({
      imports: [ContratosFormComponent, HttpClientTestingModule],
      providers: [
        { provide: SeguroService, useValue: seguroServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosFormComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar nuevo contrato si no se provee input', () => {
    authServiceSpy.getUsuarioId.and.returnValue(5);
    seguroServiceSpy.obtenerSegurosActivos.and.returnValue(of([]));
    usuarioServiceSpy.obtenerPorRol.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.contrato?.clienteId).toBe(5);
    expect(component.seguros).toEqual([]);
    expect(component.agentes).toEqual([]);
  });

  it('debería usar contrato existente si se provee', () => {
    const contratoMock: Contrato = {
      clienteId: 1,
      seguroId: 1,
      agenteId: 2,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      firmaElectronica: '',
      beneficiarios: [],
    };

    seguroServiceSpy.obtenerSegurosActivos.and.returnValue(of([]));
    usuarioServiceSpy.obtenerPorRol.and.returnValue(of([]));

    component.contrato = contratoMock;
    fixture.detectChanges();

    expect(component.contrato!.clienteId).toBe(1);
  });

  it('debería cargar seguros y agentes', () => {
    seguroServiceSpy.obtenerSegurosActivos.and.returnValue(
      of([
        {
          id: 1,
          nombre: 'Seguro',
          tipo: 'VIDA',
          descripcion: 'Cobertura test',
          cobertura: 'Todo riesgo',
          precioAnual: 500,
          activo: true,
        },
      ])
    );

    usuarioServiceSpy.obtenerPorRol.and.returnValue(
      of([
        {
          id: 1,
          nombre: 'Agente',
          apellido: 'Pérez',
          email: 'agente@test.com',
          telefono: '123456789',
          rolId: 2,
          rolNombre: 'AGENTE',
          activo: true,
        },
      ])
    );

    component.ngOnInit();

    expect(component.seguros.length).toBe(1);
    expect(component.agentes.length).toBe(1);
  });

  it('debería agregar y eliminar beneficiario', () => {
    component.contrato = component.getNuevoContrato();
    component.agregarBeneficiario();
    expect(component.contrato.beneficiarios.length).toBe(1);

    component.eliminarBeneficiario(0);
    expect(component.contrato.beneficiarios.length).toBe(0);
  });

  it('debería emitir evento al cancelar', () => {
    spyOn(component.cancelado, 'emit');
    component.cancelar();
    expect(component.cancelado.emit).toHaveBeenCalled();
  });

  it('debería crear un nuevo contrato y emitir evento', () => {
    const contrato: Contrato = {
      clienteId: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      beneficiarios: [],
    };
    component.contrato = contrato;
    spyOn(window, 'alert');
    spyOn(component.guardado, 'emit');
    contratoServiceSpy.crearContrato.and.returnValue(
      of({ ...contrato, id: 1 })
    );

    component.guardarContrato();

    expect(contratoServiceSpy.crearContrato).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Contrato creado con éxito');
    expect(component.guardado.emit).toHaveBeenCalled();
  });

  it('debería actualizar un contrato existente y emitir evento', () => {
    const contrato: Contrato = {
      id: 1,
      clienteId: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      beneficiarios: [],
    };
    component.contrato = contrato;
    spyOn(window, 'alert');
    spyOn(component.guardado, 'emit');
    contratoServiceSpy.actualizarContrato.and.returnValue(of(contrato));

    component.guardarContrato();

    expect(contratoServiceSpy.actualizarContrato).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Contrato actualizado con éxito');
    expect(component.guardado.emit).toHaveBeenCalled();
  });

  it('debería manejar error al guardar contrato', () => {
    const contrato: Contrato = {
      clienteId: 1,
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      frecuenciaPago: 'MENSUAL',
      estado: 'ACTIVO',
      beneficiarios: [],
    };
    component.contrato = contrato;
    spyOn(console, 'error');
    contratoServiceSpy.crearContrato.and.returnValue(
      throwError(() => new Error('Error al guardar'))
    );

    component.guardarContrato();

    expect(console.error).toHaveBeenCalledWith(
      'Error al guardar contrato',
      jasmine.any(Error)
    );
  });
});
