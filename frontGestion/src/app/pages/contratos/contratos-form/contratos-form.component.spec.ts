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
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ContratosFormComponent', () => {
  let component: ContratosFormComponent;
  let fixture: ComponentFixture<ContratosFormComponent>;
  let seguroServiceSpy: jasmine.SpyObj<SeguroService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

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
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContratosFormComponent, HttpClientTestingModule],
      providers: [
        { provide: SeguroService, useValue: seguroServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosFormComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar un nuevo contrato si no se provee input', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10);
    seguroServiceSpy.obtenerSegurosActivos.and.returnValue(of([]));
    usuarioServiceSpy.obtenerPorRol.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.contrato?.clienteId).toBe(10);
    expect(component.contrato?.estado).toBe('PENDIENTE');
  });

  it('debería agregar y validar beneficiario correctamente para tipo VIDA', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10); // ✅ clienteId

    const contrato = component.getNuevoContrato();
    component.contrato = contrato;
    component.contrato.agenteId = 2; // ✅ requerido
    component.contrato.fechaFin = '2025-12-31'; // ✅ requerido
    component.seguros = [
      {
        id: 1,
        tipo: 'VIDA',
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 100,
        activo: true,
      },
    ];
    component.contrato.seguroId = 1;

    component.onSeguroChange();

    expect(component.mostrarCamposBeneficiarios).toBeTrue();
    expect(component.contrato.beneficiarios.length).toBe(1);

    // Llenar datos requeridos
    const beneficiario = component.contrato.beneficiarios[0];
    Object.assign(beneficiario, {
      nombre: 'Juan',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '1234567890',
      fechaNacimiento: '1990-01-01',
      nacionalidad: 'Ecuatoriana',
      parentesco: 'HIJO/A',
      porcentaje: 100,
      estatura: '175',
      peso: '70',
      lugarNacimiento: 'Quito',
    });

    expect(component.validarFormulario()).toBeTrue(); // ✅ ahora sí
  });

  it('debería fallar validación si porcentaje beneficiarios no es 100%', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10); // ✅ necesario

    const contrato = component.getNuevoContrato();
    component.contrato = contrato;
    component.contrato.agenteId = 1;
    component.contrato.fechaFin = '2025-12-31';
    component.seguros = [
      {
        id: 1,
        tipo: 'VIDA',
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 100,
        activo: true,
      },
    ];
    component.contrato.seguroId = 1;

    component.onSeguroChange();

    component.contrato.beneficiarios[0].porcentaje = 50;

    expect(component.validarFormulario()).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'El porcentaje total de beneficiarios debe ser exactamente 100%. Actualmente: 50%',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('debería validar contrato de tipo SALUD con dependiente', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10); // ✅ ← necesario

    const contrato = component.getNuevoContrato();
    component.contrato = contrato;
    component.contrato.agenteId = 1;
    component.contrato.fechaFin = '2025-12-31';
    component.seguros = [
      {
        id: 2,
        tipo: 'SALUD',
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 150,
        activo: true,
      },
    ];
    component.contrato.seguroId = 2;

    component.onSeguroChange();

    expect(component.mostrarCamposDependientes).toBeTrue();
    expect(component.contrato.dependientes.length).toBe(1);

    const dep = component.contrato.dependientes[0];
    Object.assign(dep, {
      nombre: 'Pedro',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '1102345678',
      fechaNacimiento: '2010-01-01',
      nacionalidad: 'Ecuatoriana',
      parentesco: 'HIJO/A',
      estatura: '120',
      peso: '35',
      lugarNacimiento: 'Ambato',
      tieneDiscapacidad: true,
      diagnosticoDiscapacidad: 'Autismo',
      hospitalCobertura: 'Hospital del IESS',
    });

    expect(component.validarFormulario()).toBeTrue(); // ✅ Ahora sí pasa
  });

  it('debería mostrar error si falta hospital en dependiente', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10); // ✅ clienteId

    const contrato = component.getNuevoContrato();
    component.contrato = contrato;
    component.contrato.agenteId = 1; // ✅ requerido
    component.contrato.fechaFin = '2025-12-31'; // ✅ requerido
    component.seguros = [
      {
        id: 2,
        tipo: 'SALUD',
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 150,
        activo: true,
      },
    ];
    component.contrato.seguroId = 2;

    component.onSeguroChange();

    const dep = component.contrato.dependientes[0];
    Object.assign(dep, {
      nombre: 'Carlos',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '1104567890',
      fechaNacimiento: '2015-06-01',
      nacionalidad: 'Ecuatoriana',
      parentesco: 'HIJO/A',
      estatura: '130',
      peso: '40',
      lugarNacimiento: 'Quito',
      tieneDiscapacidad: false,
      diagnosticoDiscapacidad: '', // opcional porque no tiene discapacidad
      hospitalCobertura: '', // ❌ aquí falta
    });

    expect(component.validarFormulario()).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Todos los campos de dependientes deben estar completos',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('debería emitir evento al cancelar', () => {
    spyOn(component.cancelado, 'emit');
    component.cancelar();
    expect(component.cancelado.emit).toHaveBeenCalled();
  });

  it('debería crear contrato formateado correctamente para tipo VIDA', () => {
    authServiceSpy.getUsuarioId.and.returnValue(10); // ✅ clienteId

    const contrato = component.getNuevoContrato();
    component.contrato = contrato;
    component.contrato.agenteId = 2;
    component.contrato.fechaFin = '2024-12-31';
    component.seguros = [
      {
        id: 1,
        tipo: 'VIDA',
        nombre: '',
        descripcion: '',
        cobertura: '',
        precioAnual: 100,
        activo: true,
      },
    ];
    component.contrato.seguroId = 1;

    component.onSeguroChange();

    const beneficiario = component.contrato.beneficiarios[0];
    Object.assign(beneficiario, {
      nombre: 'Juan',
      tipoIdentificacion: 'CEDULA',
      numeroIdentificacion: '1234567890',
      fechaNacimiento: '1990-01-01',
      nacionalidad: 'Ecuatoriana',
      parentesco: 'HIJO/A',
      porcentaje: 100,
      estatura: '175',
      peso: '70',
      lugarNacimiento: 'Quito',
    });

    contratoServiceSpy.crearContrato.and.returnValue(
      of({
        id: 999,
        clienteId: 1,
        seguroId: 1,
        agenteId: 2,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        frecuenciaPago: 'MENSUAL',
        estado: 'ACTIVO',
        firmaElectronica: '',
        beneficiarios: [],
        dependientes: [],
      })
    );

    spyOn(component.guardado, 'emit');
    component.guardarContrato();

    expect(contratoServiceSpy.crearContrato).toHaveBeenCalled();
    expect(component.guardado.emit).toHaveBeenCalled();
  });
});
