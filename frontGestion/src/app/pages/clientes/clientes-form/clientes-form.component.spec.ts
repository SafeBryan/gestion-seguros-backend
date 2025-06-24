import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { ClientesFormComponent } from './clientes-form.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { ClienteRequestDTO } from '../../../models/cliente-request.dto';
import { ClienteResponseDTO } from '../../../models/cliente-response.dto';

describe('ClientesFormComponent', () => {
  let component: ClientesFormComponent;
  let fixture: ComponentFixture<ClientesFormComponent>;
  let mockClienteService: jasmine.SpyObj<ClienteService>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ClientesFormComponent>>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockUsuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      telefono: '0999999999',
      rolId: 2,
      rolNombre: 'CLIENTE',
      activo: true
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      email: 'maria@test.com',
      telefono: '0988888888',
      rolId: 2,
      rolNombre: 'CLIENTE',
      activo: true
    }
  ];

  const mockClienteResponse: ClienteResponseDTO = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '0999999999',
    tipoIdentificacion: 'Cédula',
    numeroIdentificacion: '1234567890',
    fechaNacimiento: '1990-01-01',
    nacionalidad: 'Ecuatoriana',
    estadoCivil: 'Soltero',
    sexo: 'Masculino',
    lugarNacimiento: 'Quito',
    estatura: 1.75,
    peso: 70,
    direccion: 'Av. Principal 123'
  };

  beforeEach(async () => {
    // Crear spies para los servicios
    mockClienteService = jasmine.createSpyObj('ClienteService', [
      'crearCliente',
      'actualizarCliente',
      'obtenerCliente'
    ]);
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerPorRol']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ClientesFormComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ClienteService, useValue: mockClienteService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesFormComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialización del componente', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar en modo creación por defecto', () => {
      expect(component.isEditando).toBeFalse();
      expect(component.clienteId).toBeUndefined();
    });

    it('debería cargar usuarios al inicializar', () => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios));
      
      component.ngOnInit();
      
      expect(mockUsuarioService.obtenerPorRol).toHaveBeenCalledWith('CLIENTE');
      expect(component.usuariosClienteDisponibles).toEqual(mockUsuarios);
    });

    it('debería filtrar solo usuarios activos', () => {
      const usuariosConInactivos: Usuario[] = [
        ...mockUsuarios,
        { 
          id: 3, 
          nombre: 'Pedro', 
          apellido: 'López', 
          email: 'pedro@test.com', 
          telefono: '0977777777',
          rolId: 2,
          rolNombre: 'CLIENTE',
          activo: false 
        }
      ];
      mockUsuarioService.obtenerPorRol.and.returnValue(of(usuariosConInactivos));
      
      component.ngOnInit();
      
      expect(component.usuariosClienteDisponibles.length).toBe(2);
      expect(component.usuariosClienteDisponibles.every(u => u.activo)).toBeTrue();
    });
  });

  describe('Modo edición', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          ClientesFormComponent,
          BrowserAnimationsModule
        ],
        providers: [
          { provide: ClienteService, useValue: mockClienteService },
          { provide: UsuarioService, useValue: mockUsuarioService },
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MatSnackBar, useValue: mockSnackBar },
          { provide: MAT_DIALOG_DATA, useValue: { clienteId: 1 } }
        ]
      });
      fixture = TestBed.createComponent(ClientesFormComponent);
      component = fixture.componentInstance;
    });

    it('debería inicializar en modo edición cuando se proporciona clienteId', () => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios));
      mockClienteService.obtenerCliente.and.returnValue(of(mockClienteResponse));
      
      component.ngOnInit();
      
      expect(component.isEditando).toBeTrue();
      expect(component.clienteId).toBe(1);
      expect(mockClienteService.obtenerCliente).toHaveBeenCalledWith(1);
    });

    it('debería cargar datos del cliente en modo edición', () => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios));
      mockClienteService.obtenerCliente.and.returnValue(of(mockClienteResponse));
      
      component.ngOnInit();
      
      expect(component.cliente.tipoIdentificacion).toBe('Cédula');
      expect(component.cliente.numeroIdentificacion).toBe('1234567890');
      expect(component.cliente.fechaNacimiento).toBe('1990-01-01');
    });
  });

  describe('Validación del formulario', () => {
    beforeEach(() => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios));
      fixture.detectChanges();
    });

    it('debería ser inválido cuando faltan campos requeridos', () => {
      component.cliente = {
        usuarioId: 0,
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        fechaNacimiento: '',
        nacionalidad: '',
        estadoCivil: '',
        sexo: '',
        lugarNacimiento: '',
        estatura: 0,
        peso: 0,
        direccion: ''
      };
      
      expect(component.isFormValid).toBeFalse();
    });

    it('debería ser válido cuando todos los campos requeridos están completos', () => {
      component.cliente = {
        usuarioId: 1,
        tipoIdentificacion: 'Cédula',
        numeroIdentificacion: '1234567890',
        fechaNacimiento: '1990-01-01',
        nacionalidad: '',
        estadoCivil: '',
        sexo: '',
        lugarNacimiento: '',
        estatura: 0,
        peso: 0,
        direccion: ''
      };
      
      expect(component.isFormValid).toBeTrue();
    });

    it('debería validar formulario sin usuario en modo edición', () => {
      component.isEditando = true;
      component.cliente = {
        usuarioId: 0,
        tipoIdentificacion: 'Cédula',
        numeroIdentificacion: '1234567890',
        fechaNacimiento: '1990-01-01',
        nacionalidad: '',
        estadoCivil: '',
        sexo: '',
        lugarNacimiento: '',
        estatura: 0,
        peso: 0,
        direccion: ''
      };
      
      expect(component.isFormValid).toBeTrue();
    });
  });

  describe('Guardar cliente', () => {
    beforeEach(() => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios));
      fixture.detectChanges();
    });

    it('debería crear cliente exitosamente', () => {
      component.cliente = {
        usuarioId: 1,
        tipoIdentificacion: 'Cédula',
        numeroIdentificacion: '1234567890',
        fechaNacimiento: '1990-01-01',
        nacionalidad: 'Ecuatoriana',
        estadoCivil: 'Soltero',
        sexo: 'Masculino',
        lugarNacimiento: 'Quito',
        estatura: 1.75,
        peso: 70,
        direccion: 'Av. Principal 123'
      };
      mockClienteService.crearCliente.and.returnValue(of({} as ClienteResponseDTO));
      
      component.guardar();
      
      expect(mockClienteService.crearCliente).toHaveBeenCalledWith(component.cliente);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Cliente creado correctamente', 'Cerrar', jasmine.any(Object));
      expect(mockDialogRef.close).toHaveBeenCalledWith('guardado');
    });

    it('debería actualizar cliente exitosamente', () => {
      component.isEditando = true;
      component.clienteId = 1;
      component.cliente = {
        usuarioId: 1,
        tipoIdentificacion: 'Cédula',
        numeroIdentificacion: '1234567890',
        fechaNacimiento: '1990-01-01',
        nacionalidad: 'Ecuatoriana',
        estadoCivil: 'Casado',
        sexo: 'Masculino',
        lugarNacimiento: 'Quito',
        estatura: 1.75,
        peso: 70,
        direccion: 'Av. Principal 123'
      };
      mockClienteService.actualizarCliente.and.returnValue(of({} as ClienteResponseDTO));
      
      component.guardar();
      
      expect(mockClienteService.actualizarCliente).toHaveBeenCalledWith(1, component.cliente);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Cliente actualizado correctamente', 'Cerrar', jasmine.any(Object));
      expect(mockDialogRef.close).toHaveBeenCalledWith('guardado');
    });

    it('debería manejar error al crear cliente', () => {
      component.cliente = {
        usuarioId: 1,
        tipoIdentificacion: 'Cédula',
        numeroIdentificacion: '1234567890',
        fechaNacimiento: '1990-01-01',
        nacionalidad: '',
        estadoCivil: '',
        sexo: '',
        lugarNacimiento: '',
        estatura: 0,
        peso: 0,
        direccion: ''
      };
      mockClienteService.crearCliente.and.returnValue(throwError('Error del servidor'));
      
      component.guardar();
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error al crear cliente', 'Cerrar', jasmine.any(Object));
      expect(component.loading).toBeFalse();
    });

    it('no debería guardar si el formulario es inválido', () => {
      component.cliente = {
        usuarioId: 0,
        tipoIdentificacion: '',
        numeroIdentificacion: '',
        fechaNacimiento: '',
        nacionalidad: '',
        estadoCivil: '',
        sexo: '',
        lugarNacimiento: '',
        estatura: 0,
        peso: 0,
        direccion: ''
      };
      
      component.guardar();
      
      expect(mockClienteService.crearCliente).not.toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Debe seleccionar un usuario', 'Cerrar', jasmine.any(Object));
    });
  });

  describe('Validaciones específicas', () => {
    it('debería validar que se seleccione un usuario en modo creación', () => {
      component.isEditando = false;
      component.cliente.usuarioId = 0;
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBeFalse();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Debe seleccionar un usuario', 'Cerrar', jasmine.any(Object));
    });

    it('debería validar que se seleccione tipo de identificación', () => {
      component.cliente.usuarioId = 1;
      component.cliente.tipoIdentificacion = '';
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBeFalse();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Debe seleccionar el tipo de identificación', 'Cerrar', jasmine.any(Object));
    });

    it('debería validar que se ingrese número de identificación', () => {
      component.cliente.usuarioId = 1;
      component.cliente.tipoIdentificacion = 'Cédula';
      component.cliente.numeroIdentificacion = '';
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBeFalse();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Debe ingresar el número de identificación', 'Cerrar', jasmine.any(Object));
    });

    it('debería validar que se seleccione fecha de nacimiento', () => {
      component.cliente.usuarioId = 1;
      component.cliente.tipoIdentificacion = 'Cédula';
      component.cliente.numeroIdentificacion = '1234567890';
      component.cliente.fechaNacimiento = '';
      
      const resultado = component.validarFormulario();
      
      expect(resultado).toBeFalse();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Debe seleccionar la fecha de nacimiento', 'Cerrar', jasmine.any(Object));
    });
  });

  describe('Manejo de errores', () => {
    it('debería manejar error al cargar usuarios', () => {
      mockUsuarioService.obtenerPorRol.and.returnValue(throwError('Error de red'));
      
      component.cargarUsuariosCliente();
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error al cargar usuarios', 'Cerrar', jasmine.any(Object));
      expect(component.loading).toBeFalse();
    });

    it('debería manejar error al cargar cliente', () => {
      mockClienteService.obtenerCliente.and.returnValue(throwError('Error de red'));
      
      component.cargarCliente(1);
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error al cargar cliente', 'Cerrar', jasmine.any(Object));
      expect(component.loading).toBeFalse();
    });
  });

  describe('Acciones del diálogo', () => {
    it('debería cerrar el diálogo al cancelar', () => {
      component.cancelar();
      
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('debería mostrar notificación con tipo success', () => {
      component.mostrarNotificacion('Mensaje de éxito', 'success');
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('Mensaje de éxito', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    });

    it('debería mostrar notificación con tipo error', () => {
      component.mostrarNotificacion('Mensaje de error', 'error');
      
      expect(mockSnackBar.open).toHaveBeenCalledWith('Mensaje de error', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  });

  describe('Utilidades', () => {
    it('debería formatear fecha correctamente', () => {
      const fechaISO = '2023-12-25T10:30:00Z';
      const resultado = component.formatearFechaParaInput(fechaISO);
      
      expect(resultado).toBe('2023-12-25');
    });

    it('debería manejar fecha vacía', () => {
      const resultado = component.formatearFechaParaInput('');
      
      expect(resultado).toBe('');
    });
  });

  describe('Estados de carga', () => {
    it('debería mostrar loading durante la carga de usuarios', () => {
      mockUsuarioService.obtenerPorRol.and.returnValue(of(mockUsuarios).pipe());
      
      component.cargarUsuariosCliente();
      
      // Verificar que se activa el loading
      expect(component.loading).toBeTrue();
    });

    it('debería deshabilitar botones durante loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const botones = fixture.nativeElement.querySelectorAll('button');
      botones.forEach((boton: HTMLButtonElement) => {
        expect(boton.disabled).toBeTrue();
      });
    });
  });
});