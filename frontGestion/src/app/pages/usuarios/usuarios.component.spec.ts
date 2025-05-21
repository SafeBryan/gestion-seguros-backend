import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { RolService } from '../../core/services/rol.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockRolService: jasmine.SpyObj<RolService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const usuariosMock: Usuario[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      telefono: '123',
      rolId: 1,
      rolNombre: 'Admin',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Ana',
      apellido: 'Gómez',
      email: 'ana@test.com',
      telefono: '456',
      rolId: 2,
      rolNombre: 'Usuario',
      activo: true,
    },
  ];

  const rolesMock = [
    { id: 1, nombre: 'Admin' },
    { id: 2, nombre: 'Usuario' },
  ];

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerTodos',
      'crear',
      'editar',
      'eliminar',
    ]);

    mockRolService = jasmine.createSpyObj('RolService', ['obtenerTodos']);

    mockDialog = {
      open: jasmine
        .createSpy('open')
        .and.returnValue({ afterClosed: () => of(null) } as any),
      closeAll: jasmine.createSpy('closeAll'), // ahora es un espía seguro
    } as jasmine.SpyObj<MatDialog>;

    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: RolService, useValue: mockRolService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar usuarios y roles al iniciar', fakeAsync(() => {
    mockUsuarioService.obtenerTodos.and.returnValue(of(usuariosMock));
    mockRolService.obtenerTodos.and.returnValue(of(rolesMock));

    component.ngOnInit();
    tick();

    expect(mockUsuarioService.obtenerTodos).toHaveBeenCalled();
    expect(mockRolService.obtenerTodos).toHaveBeenCalled();
    expect(component.usuarios.length).toBe(2);
    expect(component.roles.length).toBe(2);
  }));

  it('debe manejar error al cargar usuarios', fakeAsync(() => {
    spyOn(console, 'error');
    const notificacionSpy = spyOn(component as any, 'mostrarNotificacion');

    mockUsuarioService.obtenerTodos.and.returnValue(
      throwError(() => new Error('Error de red'))
    );
    mockRolService.obtenerTodos.and.returnValue(of([]));

    component.ngOnInit();
    tick();

    expect(component.loading).toBeFalse();
    expect(notificacionSpy).toHaveBeenCalledWith(
      'Error al cargar usuarios',
      'error'
    );
  }));

  it('debe aplicar filtro correctamente', () => {
    component.dataSource.data = usuariosMock;
    const inputEvent = { target: { value: 'juan' } } as unknown as Event;
    component.applyFilter(inputEvent);
    expect(component.dataSource.filter).toBe('juan');
  });

  it('debe configurar modo de edición y abrir diálogo al editar', () => {
    const usuario = usuariosMock[0];
    spyOn(component as any, 'abrirDialog');

    component.editarUsuario(usuario);

    expect(component.modoEdicion).toBeTrue();
    expect(component.usuarioEditando).toEqual(usuario);
    expect(component['abrirDialog']).toHaveBeenCalled();
  });

  it('debe retornar el id del usuario en trackByUsuarioId', () => {
    const id = component.trackByUsuarioId(0, usuariosMock[0]);
    expect(id).toBe(1);
  });

  it('debe reiniciar el formulario y abrir diálogo al crear usuario', () => {
    spyOn(component as any, 'abrirDialog');

    component.crearUsuario();

    expect(component.modoEdicion).toBeFalse();
    expect(component.usuarioEditando).toBeNull();
    expect(component.nuevoUsuario.email).toBe('');
    expect(component['abrirDialog']).toHaveBeenCalled();
  });

  it('debe retornar clases correctas según el rol', () => {
    expect(component.getRoleClass('Admin')).toBe('role-admin');
    expect(component.getRoleClass('Medico')).toBe('role-medico');
    expect(component.getRoleClass('Usuario')).toBe('role-usuario');
    expect(component.getRoleClass('Otro')).toBe('role-default');
    expect(component.getRoleClass('')).toBe('role-default');
  });

  it('debe crear usuario correctamente y mostrar notificación', fakeAsync(() => {
    mockUsuarioService.crear.and.returnValue(of(usuariosMock[0]));
    const notificacionSpy = spyOn(component as any, 'mostrarNotificacion');
    spyOn(component, 'cargarUsuarios');

    // 💡 Sustituir método `closeAll` directamente
    component['dialog'].closeAll = jasmine.createSpy('closeAll');

    component.modoEdicion = false;
    component.nuevoUsuario = {
      email: usuariosMock[0].email,
      password: '123',
      nombre: usuariosMock[0].nombre,
      apellido: usuariosMock[0].apellido,
      telefono: usuariosMock[0].telefono || '',
      rolId: usuariosMock[0].rolId,
    };

    component.guardarUsuario();
    tick();

    expect(mockUsuarioService.crear).toHaveBeenCalled();
    expect(component.cargarUsuarios).toHaveBeenCalled();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(notificacionSpy).toHaveBeenCalledWith(
      'Usuario creado correctamente',
      'success'
    );
  }));

  it('debe manejar error al crear usuario', fakeAsync(() => {
    mockUsuarioService.crear.and.returnValue(
      throwError(() => new Error('Falló'))
    );
    const notificacionSpy = spyOn(component as any, 'mostrarNotificacion');

    component.modoEdicion = false;
    component.nuevoUsuario = {
      email: usuariosMock[0].email,
      password: '123',
      nombre: usuariosMock[0].nombre,
      apellido: usuariosMock[0].apellido,
      telefono: usuariosMock[0].telefono || '',
      rolId: usuariosMock[0].rolId,
    };

    component.guardarUsuario();
    tick();

    expect(notificacionSpy).toHaveBeenCalledWith(
      'Error al crear usuario',
      'error'
    );
  }));
  it('debe llamar snackBar.open al mostrarNotificacion()', () => {
    component['snackBar'].open = jasmine.createSpy('open');
    component['mostrarNotificacion']('Mensaje prueba', 'error');

    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Mensaje prueba',
      'Cerrar',
      {
        duration: 3000,
        panelClass: ['error-snackbar'],
      }
    );
  });
  it('debe usar clase correcta para notificación success', () => {
    component['snackBar'].open = jasmine.createSpy('open');
    component['mostrarNotificacion']('Creado con éxito', 'success');

    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Creado con éxito',
      'Cerrar',
      {
        duration: 3000,
        panelClass: ['success-snackbar'],
      }
    );
  });
  it('debe ejecutar guardarUsuario si el resultado es "save" al cerrar el diálogo', () => {
    const guardarSpy = spyOn(component, 'guardarUsuario');

    // Simula dialog.open().afterClosed() → "save"
    const dialogRefMock = {
      afterClosed: () => of('save'),
    } as any;

    component['dialogTemplate'] = {} as any;
    component['dialog'] = {
      open: jasmine.createSpy().and.returnValue(dialogRefMock),
    } as any;

    component['abrirDialog']();

    expect(component['dialog'].open).toHaveBeenCalled();
    expect(guardarSpy).toHaveBeenCalled();
  });
  it('debe editar usuario correctamente', fakeAsync(() => {
    mockUsuarioService.editar.and.returnValue(of(usuariosMock[0]));
    const notificacionSpy = spyOn(component as any, 'mostrarNotificacion');
    spyOn(component, 'cargarUsuarios');
    component['dialog'].closeAll = jasmine.createSpy();

    component.modoEdicion = true;
    component.usuarioEditando = usuariosMock[0];
    component.nuevoUsuario = {
      email: usuariosMock[0].email,
      password: '123',
      nombre: usuariosMock[0].nombre,
      apellido: usuariosMock[0].apellido,
      telefono: usuariosMock[0].telefono!,
      rolId: usuariosMock[0].rolId,
    };

    component.guardarUsuario();
    tick();

    expect(mockUsuarioService.editar).toHaveBeenCalledWith(
      1,
      jasmine.any(Object)
    );
    expect(component.cargarUsuarios).toHaveBeenCalled();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(notificacionSpy).toHaveBeenCalledWith(
      'Usuario editado correctamente',
      'success'
    );
  }));
  it('debe manejar error al editar usuario', fakeAsync(() => {
    mockUsuarioService.editar.and.returnValue(
      throwError(() => new Error('Fallo'))
    );
    const notificacionSpy = spyOn(component as any, 'mostrarNotificacion');
    component.modoEdicion = true;
    component.usuarioEditando = usuariosMock[0];
    component.nuevoUsuario = {
      email: usuariosMock[0].email,
      password: '123',
      nombre: usuariosMock[0].nombre,
      apellido: usuariosMock[0].apellido,
      telefono: usuariosMock[0].telefono!,
      rolId: usuariosMock[0].rolId,
    };

    component.guardarUsuario();
    tick();

    expect(notificacionSpy).toHaveBeenCalledWith(
      'Error al editar usuario',
      'error'
    );
  }));

  
});
