import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SegurosComponent } from './seguros.component';
import { SeguroService } from '../../core/services/seguro.service';
import { AuthService } from '../../services/auth.service';
import { Seguro } from '../../models/seguro.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';

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

  it('debería manejar error al crear seguro', () => {
    mockSeguroService.crearSeguro.and.returnValue(
      throwError(() => new Error('Error'))
    );
    mockAuthService.getUsuarioId.and.returnValue(1);
    spyOn(console, 'error');

    component.seguroForm.patchValue({
      ...mockSeguro,
      cobertura: ['Hospitalización', 'Medicamentos'], // ✅ como array
    });

    component.guardarSeguro();

    expect(console.error).toHaveBeenCalled();
  });

  it('debería generar id con trackBySeguroId', () => {
    expect(component.trackBySeguroId(0, mockSeguro)).toBe(mockSeguro.id);
  });

  //   it('debería resetear datos y abrir el modal al crearSeguro()', () => {
  //   const dialogSpy = spyOn(component['dialog'], 'open'); // Espiamos el open()

  //   component.crearSeguro();

  //   expect(dialogSpy).toHaveBeenCalled();
  //   expect(component.nuevoSeguro.nombre).toBe('');
  // });

  // it('debería resetear datos y mostrar el modal al crearSeguro()', () => {
  //   component.crearSeguro();
  //   expect(component.mostrarModal).toBeTrue();
  //   expect(component.nuevoSeguro.nombre).toBe('');
  // });

  it('debería cerrar el modal al ejecutar cerrarModal()', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    component.dialogRef = dialogRefSpy;

    component.cerrarModal();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  // it('debería cerrar el modal al ejecutar cerrarModal()', () => {
  //   component.mostrarModal = true;
  //   component.cerrarModal();
  //   expect(component.mostrarModal).toBeFalse();
  // });

  // it('debería guardar un nuevo seguro y recargar la lista', () => {
  //   mockSeguroService.crearSeguro.and.returnValue(of(mockSeguro));
  //   mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
  //   mockAuthService.getUsuarioId.and.returnValue(42);

  //   spyOn(component, 'cargarSeguros').and.callThrough();
  //   spyOn(component, 'cerrarModal').and.callThrough();

  //   component.guardarSeguro();

  //   expect(mockSeguroService.crearSeguro).toHaveBeenCalled();
  //   expect(component.cargarSeguros).toHaveBeenCalled();
  //   expect(component.cerrarModal).toHaveBeenCalled();
  // });

  // it('debería manejar error al guardar seguro', () => {
  //   spyOn(console, 'error');
  //   mockSeguroService.crearSeguro.and.returnValue(
  //     throwError(() => new Error('Error'))
  //   );
  //   mockAuthService.getUsuarioId.and.returnValue(1);

  //   component.guardarSeguro();

  //   expect(console.error).toHaveBeenCalled();
  // });

  // it('debería preparar seguro para edición', () => {
  //   component.editarSeguro(mockSeguro);
  //   expect(component.mostrarModal).toBeTrue();
  //   expect(component.nuevoSeguro.nombre).toBe(mockSeguro.nombre);
  // });

  // it('debería editar un seguro existente y recargar la lista', () => {
  //   mockSeguroService.editarSeguro = jasmine
  //     .createSpy()
  //     .and.returnValue(of(mockSeguro));
  //   mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
  //   mockAuthService.getUsuarioId.and.returnValue(42);

  //   spyOn(component, 'cargarSeguros').and.callThrough();
  //   spyOn(component, 'cerrarModal').and.callThrough();

  //   component.nuevoSeguro = { ...mockSeguro }; // Contiene id → modo edición
  //   component.guardarSeguro();

  //   expect(mockSeguroService.editarSeguro).toHaveBeenCalledWith(
  //     99,
  //     jasmine.any(Object)
  //   );
  //   expect(component.cargarSeguros).toHaveBeenCalled();
  //   expect(component.cerrarModal).toHaveBeenCalled();
  // });

  // it('debería manejar error al editar seguro', () => {
  //   mockSeguroService.editarSeguro = jasmine
  //     .createSpy()
  //     .and.returnValue(throwError(() => new Error('Falló edición')));
  //   spyOn(console, 'error');
  //   mockAuthService.getUsuarioId.and.returnValue(42);

  //   component.nuevoSeguro = { ...mockSeguro }; // Tiene id → modo edición
  //   component.guardarSeguro();

  //   expect(console.error).toHaveBeenCalledWith(
  //     'Error al editar el seguro',
  //     jasmine.any(Error)
  //   );
  // });

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

  it('debería guardar un nuevo seguro y recargar la lista', () => {
    mockSeguroService.crearSeguro.and.returnValue(of(mockSeguro));
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
    mockAuthService.getUsuarioId.and.returnValue(42);
    spyOn(component, 'cargarSeguros').and.callThrough();
    spyOn(component, 'cerrarModal').and.callThrough();

    component.seguroForm.patchValue({
      ...mockSeguro,
      cobertura: ['Hospitalización', 'Medicamentos'], // ✅ cambio clave
    });

    component.guardarSeguro();

    expect(mockSeguroService.crearSeguro).toHaveBeenCalled();
    expect(component.cargarSeguros).toHaveBeenCalled();
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('debería manejar error al crear seguro', () => {
    mockSeguroService.crearSeguro.and.returnValue(
      throwError(() => new Error('Error'))
    );
    mockAuthService.getUsuarioId.and.returnValue(1);
    spyOn(console, 'error');

    component.seguroForm.patchValue({
      ...mockSeguro,
      cobertura: ['Fallecimiento Natural'], // ← este cambio evita el .join error
    });

    component.guardarSeguro();

    expect(console.error).toHaveBeenCalled();
  });
  it('debería editar un seguro existente y recargar la lista', () => {
    mockSeguroService.editarSeguro = jasmine
      .createSpy()
      .and.returnValue(of(mockSeguro));
    mockSeguroService.obtenerTodosLosSeguros.and.returnValue(of(mockSeguros));
    mockAuthService.getUsuarioId.and.returnValue(42);

    spyOn(component, 'cargarSeguros').and.callThrough();
    spyOn(component, 'cerrarModal').and.callThrough();

    component.editMode = true;

    // ✅ Poner cobertura como array ANTES de ejecutar guardarSeguro()
    component.seguroForm.patchValue({
      ...mockSeguro,
      id: 99,
      cobertura: ['Fallecimiento Natural', 'Invalidez Permanente'],
    });

    component.guardarSeguro(); // ← ahora sí, con valores válidos

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
    mockAuthService.getUsuarioId.and.returnValue(1);
    spyOn(console, 'error');

    component.editMode = true;
    component.seguroForm.patchValue({
      ...mockSeguro,
      id: 99,
      cobertura: ['Fallecimiento Natural'],
    });

    component.guardarSeguro(); // ✅ llamada faltante

    expect(console.error).toHaveBeenCalled();
  });

  it('debería activar un seguro', () => {
    mockSeguroService.actualizarEstado = jasmine
      .createSpy()
      .and.returnValue(of(mockSeguro));
    spyOn(component, 'cargarSeguros');

    component.activarSeguro(mockInactivo);

    expect(mockSeguroService.actualizarEstado).toHaveBeenCalledWith(100, true);
    expect(component.cargarSeguros).toHaveBeenCalled();
  });
  it('debería manejar error al activar seguro', () => {
    mockSeguroService.actualizarEstado = jasmine
      .createSpy()
      .and.returnValue(throwError(() => new Error('Fallo activando')));
    spyOn(console, 'error');

    component.activarSeguro(mockInactivo);

    expect(console.error).toHaveBeenCalled();
  });
  it('debería retornar color según tipo de seguro', () => {
    expect(component.getTipoColor('VIDA')).toBe('primary');
    expect(component.getTipoColor('SALUD')).toBe('accent');
  });

  it('debería formatear precio correctamente', () => {
    expect(component.formatearPrecio(2500)).toContain('$');
  });

  it('debería exponer los getters del formulario', () => {
    component.seguroForm.patchValue(mockSeguro);
    expect(component.nombre?.value).toBe('Test Seguro');
    expect(component.tipo?.value).toBe('VIDA');
    expect(component.descripcion?.value).toBe('Descripción test');
  });

  it('debería resetear el formulario y abrir el modal en crearSeguro()', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    (component as any).dialog = dialogSpy;
    (component as any).dialogTemplate = {} as TemplateRef<any>;

    component.crearSeguro();

    expect(component.editMode).toBeFalse();
    expect(component.seguroForm.value.tipo).toBe('VIDA');
    expect(dialogSpy.open).toHaveBeenCalledWith(
      component['dialogTemplate'],
      jasmine.any(Object)
    );
  });

  it('debería cargar los datos en el formulario al editar seguro', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    // Simulamos `dialog` y `dialogTemplate`
    (component as any).dialog = dialogSpy;
    (component as any).dialogTemplate = {} as TemplateRef<any>;

    component.editarSeguro(mockSeguro);

    expect(component.editMode).toBeTrue();
    expect(component.seguroForm.value.nombre).toBe(mockSeguro.nombre);
    expect(dialogSpy.open).toHaveBeenCalledWith(
      component['dialogTemplate'],
      jasmine.any(Object)
    );
  });
});
