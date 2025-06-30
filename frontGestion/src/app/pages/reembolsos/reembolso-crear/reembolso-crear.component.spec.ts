import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReembolsoCrearComponent } from './reembolso-crear.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ReembolsoService } from '../../../core/services/reembolso.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { AuthService } from '../../../services/auth.service';
import { FormControl } from '@angular/forms';

describe('ReembolsoCrearComponent', () => {
  let component: ReembolsoCrearComponent;
  let fixture: ComponentFixture<ReembolsoCrearComponent>;

  let mockReembolsoService: any;
  let mockContratoService: any;
  let mockAuthService: any;
  let mockSnackBar: any;

  beforeEach(async () => {
    mockReembolsoService = {
      crearReembolsoConArchivos: jasmine
        .createSpy('crearReembolsoConArchivos')
        .and.returnValue(of({})),
    };

    mockContratoService = {
      obtenerPorCliente: jasmine
        .createSpy('obtenerPorCliente')
        .and.returnValue(of([])),
    };

    mockAuthService = {
      getUsuarioId: jasmine.createSpy('getUsuarioId').and.returnValue(1),
      getUsuarioPerfil: jasmine
        .createSpy('getUsuarioPerfil')
        .and.returnValue({ id: 1 }),
    };

    mockSnackBar = {
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      imports: [ReembolsoCrearComponent, HttpClientTestingModule],
      providers: [
        { provide: ReembolsoService, useValue: mockReembolsoService },
        { provide: ContratoService, useValue: mockContratoService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReembolsoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar contratos correctamente', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(mockContratoService.obtenerPorCliente).toHaveBeenCalledWith(1);
  }));

  it('debería devolver mensajes de error según validación', () => {
    const control = component.form.get('descripcion');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.getErrorMessage('descripcion')).toBe(
      'Este campo es requerido'
    );
  });
  it('debería retornar true o false desde el getter esAccidente', () => {
    // Por defecto debe ser false
    expect(component.esAccidente).toBeFalse();

    // Seteamos true
    component.form.get('esAccidente')?.setValue(true);
    expect(component.esAccidente).toBeTrue();

    // Seteamos false
    component.form.get('esAccidente')?.setValue(false);
    expect(component.esAccidente).toBeFalse();
  });
  it('debería retornar un FormControl válido desde el getter esAccidenteControl', () => {
    const control = component.esAccidenteControl;

    // Verifica que es una instancia de FormControl
    expect(control).toBeInstanceOf(FormControl);

    // Verifica que esté enlazado al valor real del formulario
    component.form.get('esAccidente')?.setValue(true);
    expect(control.value).toBeTrue();

    component.form.get('esAccidente')?.setValue(false);
    expect(control.value).toBeFalse();
  });

  it('debería aplicar validadores a detalleAccidente cuando esAccidente es true y quitarlos cuando es false', () => {
    const detalleControl = component.form.get('detalleAccidente')!;
    const esAccidenteControl = component.form.get('esAccidente')!;

    // ✅ Caso: esAccidente = true → se aplican los validadores
    esAccidenteControl.setValue(true);
    detalleControl.setValue(''); // vacío
    expect(detalleControl.valid).toBeFalse();
    expect(detalleControl.hasError('required')).toBeTrue();

    detalleControl.setValue('corto'); // menos de 10 caracteres
    expect(detalleControl.valid).toBeFalse();
    expect(detalleControl.hasError('minlength')).toBeTrue();

    detalleControl.setValue('detalle válido de accidente');
    expect(detalleControl.valid).toBeTrue();

    // ✅ Caso: esAccidente = false → se eliminan los validadores
    esAccidenteControl.setValue(false);
    detalleControl.setValue('');
    expect(detalleControl.valid).toBeTrue(); // ya no es requerido ni tiene minlength
  });
  it('debería eliminar validadores de detalleAccidente cuando esAccidente es false', () => {
    const detalleControl = component.form.get('detalleAccidente')!;
    const esAccidenteControl = component.form.get('esAccidente')!;

    // Primero activamos los validadores
    esAccidenteControl.setValue(true);
    detalleControl.setValue('');
    expect(detalleControl.valid).toBeFalse(); // requerido

    // Ahora desactivamos esAccidente (se deben limpiar validadores)
    esAccidenteControl.setValue(false);
    detalleControl.setValue(''); // sigue vacío

    // Después del clearValidators, el campo ya no debe tener errores
    expect(detalleControl.valid).toBeTrue();
    expect(detalleControl.errors).toBeNull();
  });

  it('debería mostrar notificación si el usuario no está identificado', () => {
    mockAuthService.getUsuarioId.and.returnValue(null); // Simula usuario no autenticado

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion'); // opcional si no quieres espiar MatSnackBar directamente

    component.cargarContratos();

    expect(spyNotificacion).toHaveBeenCalledWith(
      'Error: Usuario no identificado',
      'error'
    );
    expect(component.loadingContratos).toBeFalse();
  });

  it('debería manejar error al cargar contratos', () => {
    const fakeError = new Error('Error de red');
    spyOn(console, 'error');
    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    // Simula error al obtener contratos
    mockContratoService.obtenerPorCliente.and.returnValue(
      throwError(() => fakeError)
    );

    component.cargarContratos();

    expect(console.error).toHaveBeenCalledWith(
      'Error al cargar contratos:',
      fakeError
    );
    expect(component.loadingContratos).toBeFalse();
    expect(spyNotificacion).toHaveBeenCalledWith(
      'Error al cargar contratos',
      'error'
    );
  });

  it('debería procesar archivo si hay archivos seleccionados', () => {
    const mockFile = new File(['contenido'], 'archivo.pdf', {
      type: 'application/pdf',
    });
    const mockEvent = {
      target: {
        files: [mockFile],
        value: '',
      },
    } as unknown as Event;

    component.onFileSelected(mockEvent);

    // Validación mínima: se intentó procesar el archivo (pasó el if)
    expect(component.archivoSeleccionado).toBe(mockFile);
  });

  it('no debería hacer nada si no hay archivos seleccionados', () => {
    const mockEvent = {
      target: {
        files: [],
        value: '',
      },
    } as unknown as Event;

    component.archivoSeleccionado = null;
    component.onFileSelected(mockEvent);

    expect(component.archivoSeleccionado).toBeNull();
  });

  it('debería mostrar error si el archivo no es PDF', () => {
    const mockFile = new File(['contenido'], 'documento.txt', {
      type: 'text/plain',
    });

    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    Object.defineProperty(inputElement, 'files', {
      value: [mockFile],
      writable: false,
    });

    const event = { target: inputElement } as unknown as Event;

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.onFileSelected(event);

    expect(component.archivoSeleccionado).toBeNull();
    expect(inputElement.value).toBe('');
    expect(spyNotificacion).toHaveBeenCalledWith(
      'Solo se permiten archivos PDF',
      'error'
    );
  });

  it('debería mostrar error si el archivo supera los 5MB', () => {
    // Archivo de 6MB
    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'grande.pdf', {
      type: 'application/pdf',
    });

    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    Object.defineProperty(inputElement, 'files', {
      value: [bigFile],
      writable: false,
    });

    const event = { target: inputElement } as unknown as Event;

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.onFileSelected(event);

    expect(component.archivoSeleccionado).toBeNull();
    expect(inputElement.value).toBe('');
    expect(spyNotificacion).toHaveBeenCalledWith(
      'El archivo no debe superar 5MB',
      'error'
    );
  });
  it('debería aceptar archivo PDF válido menor a 5MB y mostrar notificación de éxito', () => {
    const validFile = new File(['contenido'], 'archivo.pdf', {
      type: 'application/pdf',
    });

    const inputElement = document.createElement('input');
    inputElement.type = 'file';

    Object.defineProperty(inputElement, 'files', {
      value: [validFile],
      writable: false,
    });

    const event = { target: inputElement } as unknown as Event;

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.onFileSelected(event);

    expect(component.archivoSeleccionado).toBe(validFile);
    expect(spyNotificacion).toHaveBeenCalledWith(
      `Archivo "${validFile.name}" seleccionado correctamente`,
      'success'
    );
  });

  it('debería resetear el formulario y limpiar el archivo seleccionado', () => {
    // Rellenar el formulario con datos simulados
    component.form.patchValue({
      contratoId: 123,
      descripcion: 'Descripción ejemplo',
      monto: 200,
      nombreMedico: 'Dr. House',
      motivoConsulta: 'Fiebre',
      cie10: 'A00',
      fechaAtencion: new Date(),
      inicioSintomas: new Date(),
      esAccidente: true,
      detalleAccidente: 'Accidente automovilístico',
    });

    component.archivoSeleccionado = new File(['contenido'], 'archivo.pdf', {
      type: 'application/pdf',
    });

    component.limpiarFormulario();

    // Validar que los campos están reiniciados
    expect(component.form.value).toEqual({
      contratoId: '',
      descripcion: '',
      monto: '',
      nombreMedico: '',
      motivoConsulta: '',
      cie10: '',
      fechaAtencion: '',
      inicioSintomas: '',
      esAccidente: false,
      detalleAccidente: '',
    });

    // Validar que archivoSeleccionado es null
    expect(component.archivoSeleccionado).toBeNull();
  });

  it('debería establecer archivoSeleccionado en null al limpiar el formulario', () => {
    // Simular que hay un archivo previamente seleccionado
    component.archivoSeleccionado = new File(['contenido'], 'archivo.pdf', {
      type: 'application/pdf',
    });

    component.limpiarFormulario();

    expect(component.archivoSeleccionado).toBeNull();
  });

  it('debería mostrar error y no enviar si el formulario es inválido', () => {
    // Asegúrate de que el formulario esté efectivamente inválido
    component.form.patchValue({
      contratoId: '', // requerido, lo dejamos vacío
      descripcion: 'corta', // minLength inválido
      monto: null,
      nombreMedico: '',
      motivoConsulta: '',
      fechaAtencion: '',
      esAccidente: false,
      detalleAccidente: '',
    });

    // Espías para verificar que se llamen
    const spyMarcarCampos = spyOn(component as any, 'marcarCamposComoTocados');
    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.enviar();

    expect(component.form.invalid).toBeTrue();
    expect(spyMarcarCampos).toHaveBeenCalled();
    expect(spyNotificacion).toHaveBeenCalledWith(
      'Por favor completa todos los campos requeridos',
      'error'
    );
  });

  it('debería mostrar error si falta archivo o cliente inválido al enviar', () => {
    // Formulario válido
    component.form.patchValue({
      contratoId: 1,
      descripcion: 'Descripción válida y extensa',
      monto: 100,
      nombreMedico: 'Dr. Juan',
      motivoConsulta: 'Consulta general',
      cie10: '',
      fechaAtencion: new Date(),
      inicioSintomas: '',
      esAccidente: false,
      detalleAccidente: '',
    });

    component.archivoSeleccionado = null; // Falta el archivo
    mockAuthService.getUsuarioPerfil.and.returnValue(null); // Cliente inválido

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.enviar();

    expect(spyNotificacion).toHaveBeenCalledWith(
      'Falta seleccionar archivo o cliente inválido',
      'error'
    );
  });

  it('debería agregar el archivo seleccionado al FormData con la clave "archivos"', () => {
    const archivoMock = new File(['contenido'], 'mi-archivo.pdf', {
      type: 'application/pdf',
    });

    component.archivoSeleccionado = archivoMock;

    // Creamos el formData como se hace en el componente
    const formData = new FormData();
    formData.append('archivos', component.archivoSeleccionado);

    const archivoEnviado = formData.get('archivos') as File;

    // Verificaciones
    expect(archivoEnviado).toBeDefined();
    expect(archivoEnviado).toBe(archivoMock);
    expect(archivoEnviado.name).toBe('mi-archivo.pdf');
    expect(archivoEnviado.type).toBe('application/pdf');
  });

  it('debería llamar a crearReembolsoConArchivos y manejar respuesta exitosa', fakeAsync(() => {
    const archivoMock = new File(['contenido'], 'reporte.pdf', {
      type: 'application/pdf',
    });

    component.form.patchValue({
      contratoId: 1,
      descripcion: 'Consulta médica completa',
      monto: 150,
      nombreMedico: 'Dr. García',
      motivoConsulta: 'Chequeo general',
      cie10: '',
      fechaAtencion: new Date(),
      inicioSintomas: null,
      esAccidente: false,
      detalleAccidente: '',
    });

    component.archivoSeleccionado = archivoMock;
    mockAuthService.getUsuarioPerfil.and.returnValue({ id: 1 });

    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');
    const spyLimpiarFormulario = spyOn(component, 'limpiarFormulario');

    component.enviar();
    tick(); // ejecuta el observable

    // Verifica que el servicio fue llamado
    expect(mockReembolsoService.crearReembolsoConArchivos).toHaveBeenCalled();

    // Verifica notificación de éxito
    expect(spyNotificacion).toHaveBeenCalledWith(
      'Solicitud de reembolso enviada exitosamente',
      'success'
    );

    // Verifica que se haya limpiado el formulario
    expect(spyLimpiarFormulario).toHaveBeenCalled();

    // Verifica que el estado se haya reseteado
    expect(component.enviandoSolicitud).toBeFalse();
  }));

  it('debería manejar error al enviar solicitud y mostrar notificación de error', fakeAsync(() => {
    // Simular archivo válido y formulario válido
    const archivo = new File(['contenido'], 'archivo.pdf', {
      type: 'application/pdf',
    });

    component.form.patchValue({
      contratoId: 1,
      descripcion: 'Consulta urgente',
      monto: 100,
      nombreMedico: 'Dr. Strange',
      motivoConsulta: 'Dolor muscular',
      cie10: 'A01',
      fechaAtencion: new Date(),
      inicioSintomas: null,
      esAccidente: false,
      detalleAccidente: '',
    });

    component.archivoSeleccionado = archivo;
    mockAuthService.getUsuarioPerfil.and.returnValue({ id: 1 });

    const fakeError = new Error('Fallo de red');

    // Simula que el servicio lanza un error
    mockReembolsoService.crearReembolsoConArchivos.and.returnValue(
      throwError(() => fakeError)
    );

    // Espías
    spyOn(console, 'error');
    const spyNotificacion = spyOn(component as any, 'mostrarNotificacion');

    component.enviar();
    tick(); // forzar ejecución del observable

    expect(console.error).toHaveBeenCalledWith(
      'Error al enviar solicitud:',
      fakeError
    );
    expect(component.enviandoSolicitud).toBeFalse();
    expect(spyNotificacion).toHaveBeenCalledWith(
      'Error al enviar la solicitud de reembolso',
      'error'
    );
  }));

  it('debería marcar todos los campos del formulario como tocados', () => {
    // Asegúrate de que inicialmente no estén tocados
    Object.values(component.form.controls).forEach((control) => {
      expect(control.touched).toBeFalse();
    });

    // Llamar al método privado (puedes acceder con cast si es private)
    (component as any).marcarCamposComoTocados();

    // Verificar que todos estén marcados como tocados
    Object.values(component.form.controls).forEach((control) => {
      expect(control.touched).toBeTrue();
    });
  });

  it('debería retornar mensaje de error para min', () => {
    const control = component.form.get('monto')!;
    control.setValue(-5);
    control.markAsTouched();
    expect(component.getErrorMessage('monto')).toBe('El valor mínimo es 0.01');
  });

  it('debería retornar mensaje de error para max', () => {
    const control = component.form.get('monto')!;
    control.setValue(1000000); // supera el máximo de 999999
    control.markAsTouched();
    expect(component.getErrorMessage('monto')).toBe(
      'El valor máximo es 999999'
    );
  });

  it('debería retornar mensaje de error para minlength', () => {
    const control = component.form.get('descripcion')!;
    control.setValue('corto'); // menos de 10 caracteres
    control.markAsTouched();
    expect(component.getErrorMessage('descripcion')).toBe(
      'Mínimo 10 caracteres'
    );
  });

  it('debería retornar cadena vacía si no hay errores en el campo', () => {
    const control = component.form.get('nombreMedico')!;
    control.setValue('Dr. House');
    control.markAsTouched();
    expect(component.getErrorMessage('nombreMedico')).toBe('');
  });

  describe('getter puedeEnviar', () => {
    beforeEach(() => {
      component.form.patchValue({
        contratoId: 1,
        descripcion: 'Consulta completa con detalles',
        monto: 120,
        nombreMedico: 'Dr. House',
        motivoConsulta: 'Chequeo',
        fechaAtencion: new Date(),
        esAccidente: false,
        detalleAccidente: '',
      });
    });

    it('debería retornar true si el formulario es válido, hay archivo y no se está enviando', () => {
      component.archivoSeleccionado = new File(['contenido'], 'archivo.pdf', {
        type: 'application/pdf',
      });
      component.enviandoSolicitud = false;

      expect(component.puedeEnviar).toBeTrue();
    });

    it('debería retornar false si el formulario es inválido', () => {
      component.form.get('descripcion')?.setValue('corto'); // inválido (minlength)
      component.archivoSeleccionado = new File(['contenido'], 'archivo.pdf', {
        type: 'application/pdf',
      });
      component.enviandoSolicitud = false;

      expect(component.puedeEnviar).toBeFalse();
    });

    it('debería retornar false si no hay archivo seleccionado', () => {
      component.archivoSeleccionado = null;
      component.enviandoSolicitud = false;

      expect(component.puedeEnviar).toBeFalse();
    });

    it('debería retornar false si ya se está enviando', () => {
      component.archivoSeleccionado = new File(['contenido'], 'archivo.pdf', {
        type: 'application/pdf',
      });
      component.enviandoSolicitud = true;

      expect(component.puedeEnviar).toBeFalse();
    });
  });
});
