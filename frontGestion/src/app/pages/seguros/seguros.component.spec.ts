import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SegurosComponent } from './seguros.component';
import { SeguroService } from '../../core/services/seguro.service';
import { AuthService } from '../../services/auth.service';
import { Seguro } from '../../models/seguro.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SegurosComponent', () => {
  let component: SegurosComponent;
  let fixture: ComponentFixture<SegurosComponent>;
  let mockSeguroService: jasmine.SpyObj<SeguroService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockSeguro: Seguro = {
    id: 99,
    nombre: 'Test Seguro',
    tipo: 'VIDA',
    descripcion: 'Descripción test',
    cobertura: 'Cobertura test',
    precioAnual: 123,
    activo: true,
  };

  const mockInactivo: Seguro = {
    ...mockSeguro,
    id: 100,
    activo: false,
  };

  const mockSeguros: Seguro[] = [mockSeguro, mockInactivo];

  beforeEach(async () => {
    mockSeguroService = jasmine.createSpyObj('SeguroService', [
      'obtenerTodosLosSeguros',
      'crearSeguro',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUsuarioId']);

    await TestBed.configureTestingModule({
      imports: [SegurosComponent],
      providers: [
        { provide: SeguroService, useValue: mockSeguroService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SegurosComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar seguros y dividirlos en activos e inactivos', () => {
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
    fixture.detectChanges(); // ngOnInit()

    expect(component.seguros.length).toBe(2);
    expect(component.segurosActivos.length).toBe(1);
    expect(component.segurosInactivos.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar seguros', () => {
    spyOn(console, 'error');
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(
      throwError(() => new Error('Fallo'))
    );
    component.cargarSeguros();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('debería generar id con trackBySeguroId', () => {
    expect(component.trackBySeguroId(0, mockSeguro)).toBe(mockSeguro.id);
  });

  it('debería resetear datos y mostrar el modal al crearSeguro()', () => {
    component.crearSeguro();
    expect(component.mostrarModal).toBeTrue();
    expect(component.nuevoSeguro.nombre).toBe('');
  });

  it('debería cerrar el modal al ejecutar cerrarModal()', () => {
    component.mostrarModal = true;
    component.cerrarModal();
    expect(component.mostrarModal).toBeFalse();
  });

  it('debería guardar un nuevo seguro y recargar la lista', () => {
    mockSeguroService.crearSeguro.and.returnValue(of(mockSeguro));
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
    mockAuthService.getUsuarioId.and.returnValue(42);

    spyOn(component, 'cargarSeguros').and.callThrough();
    spyOn(component, 'cerrarModal').and.callThrough();

    component.guardarSeguro();

    expect(mockSeguroService.crearSeguro).toHaveBeenCalled();
    expect(component.cargarSeguros).toHaveBeenCalled();
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('debería manejar error al guardar seguro', () => {
    spyOn(console, 'error');
    mockSeguroService.crearSeguro.and.returnValue(
      throwError(() => new Error('Error'))
    );
    mockAuthService.getUsuarioId.and.returnValue(1);

    component.guardarSeguro();

    expect(console.error).toHaveBeenCalled();
  });

  it('debería preparar seguro para edición', () => {
    component.editarSeguro(mockSeguro);
    expect(component.mostrarModal).toBeTrue();
    expect(component.nuevoSeguro.nombre).toBe(mockSeguro.nombre);
  });

  it('debería editar un seguro existente y recargar la lista', () => {
    mockSeguroService.editarSeguro = jasmine
      .createSpy()
      .and.returnValue(of(mockSeguro));
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
    mockAuthService.getUsuarioId.and.returnValue(42);

    spyOn(component, 'cargarSeguros').and.callThrough();
    spyOn(component, 'cerrarModal').and.callThrough();

    component.nuevoSeguro = { ...mockSeguro }; // Contiene id → modo edición
    component.guardarSeguro();

    expect(mockSeguroService.editarSeguro).toHaveBeenCalledWith(
      99,
      jasmine.any(Object)
    );
    expect(component.cargarSeguros).toHaveBeenCalled();
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('debería manejar error al editar seguro', () => {
    mockSeguroService.editarSeguro = jasmine
      .createSpy()
      .and.returnValue(throwError(() => new Error('Falló edición')));
    spyOn(console, 'error');
    mockAuthService.getUsuarioId.and.returnValue(42);

    component.nuevoSeguro = { ...mockSeguro }; // Tiene id → modo edición
    component.guardarSeguro();

    expect(console.error).toHaveBeenCalledWith(
      'Error al editar el seguro',
      jasmine.any(Error)
    );
  });

  it('debería desactivar un seguro cuando se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockSeguroService.actualizarEstado = jasmine
      .createSpy()
      .and.returnValue(of(mockSeguro));
    spyOn(component, 'cargarSeguros');

    component.eliminarSeguro(mockSeguro);

    expect(mockSeguroService.actualizarEstado).toHaveBeenCalledWith(99, false);
    expect(component.cargarSeguros).toHaveBeenCalled();
  });

  it('debería manejar error al desactivar seguro', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockSeguroService.actualizarEstado = jasmine
      .createSpy()
      .and.returnValue(throwError(() => new Error('Error al eliminar')));
    spyOn(console, 'error');

    component.eliminarSeguro(mockSeguro);

    expect(console.error).toHaveBeenCalledWith(
      'Error al desactivar el seguro',
      jasmine.any(Error)
    );
  });

  it('no debería desactivar seguro si el usuario cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    mockSeguroService.actualizarEstado = jasmine.createSpy();

    component.eliminarSeguro(mockSeguro);

    expect(mockSeguroService.actualizarEstado).not.toHaveBeenCalled();
  });
});
