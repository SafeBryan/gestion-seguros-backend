import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioService } from '../../core/services/usuario.service';
import { RolService } from '../../core/services/rol.service';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockRolService: jasmine.SpyObj<RolService>;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@test.com',
    nombre: 'Bryan',
    apellido: 'Pazmiño',
    telefono: '123456789',
    rolId: 2,
    rolNombre: 'CLIENTE',
    activo: true,
  };

  const mockRol: Rol = {
    id: 2,
    nombre: 'CLIENTE',
  };

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerTodos',
      'crear',
      'editar',
      'eliminar',
    ]);
    mockRolService = jasmine.createSpyObj('RolService', ['obtenerTodos']);

    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: RolService, useValue: mockRolService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios y roles en ngOnInit', () => {
    mockUsuarioService.obtenerTodos.and.returnValue(of([mockUsuario]));
    mockRolService.obtenerTodos.and.returnValue(of([mockRol]));
    fixture.detectChanges();

    expect(component.usuarios.length).toBe(1);
    expect(component.roles.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar usuarios', () => {
    spyOn(console, 'error');
    mockUsuarioService.obtenerTodos.and.returnValue(
      throwError(() => new Error('Error usuarios'))
    );
    component.cargarUsuarios();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar roles', () => {
    spyOn(console, 'error');
    mockRolService.obtenerTodos.and.returnValue(
      throwError(() => new Error('Error roles'))
    );
    component.cargarRoles();
    expect(console.error).toHaveBeenCalled();
  });

  it('debería devolver el id en trackByUsuarioId', () => {
    expect(component.trackByUsuarioId(0, mockUsuario)).toBe(1);
  });

  it('debería preparar la vista para crear un nuevo usuario', () => {
    component.crearUsuario();
    expect(component.mostrarModal).toBeTrue();
    expect(component.modoEdicion).toBeFalse();
    expect(component.usuarioEditando).toBeNull();
  });

  it('debería cerrar el modal y resetear los datos al cerrarModal()', () => {
    component.mostrarModal = true;
    component.modoEdicion = true;
    component.usuarioEditando = mockUsuario;

    component.cerrarModal();

    expect(component.mostrarModal).toBeFalse();
    expect(component.modoEdicion).toBeFalse();
    expect(component.usuarioEditando).toBeNull();
  });

  it('debería crear un usuario nuevo', () => {
    spyOn(window, 'alert');
    mockUsuarioService.crear.and.returnValue(of(mockUsuario));
    mockUsuarioService.obtenerTodos.and.returnValue(of([mockUsuario]));

    component.nuevoUsuario = {
      email: 'nuevo@test.com',
      password: '123456',
      nombre: 'Nuevo',
      apellido: 'User',
      telefono: '000000',
      rolId: 2,
    };

    component.guardarUsuario();

    expect(mockUsuarioService.crear).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Usuario creado correctamente');
  });

  it('debería manejar error al crear usuario', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');
    mockUsuarioService.crear.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.guardarUsuario();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al crear usuario');
  });

  it('debería editar un usuario existente', () => {
    spyOn(window, 'alert');
    mockUsuarioService.editar.and.returnValue(of(mockUsuario));
    mockUsuarioService.obtenerTodos.and.returnValue(of([mockUsuario]));

    component.modoEdicion = true;
    component.usuarioEditando = mockUsuario;
    component.nuevoUsuario = {
      email: 'editado@test.com',
      password: '',
      nombre: 'Editado',
      apellido: 'User',
      telefono: '111111',
      rolId: 2,
    };

    component.guardarUsuario();

    expect(mockUsuarioService.editar).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Usuario actualizado correctamente'
    );
  });

  it('debería manejar error al editar usuario', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.modoEdicion = true;
    component.usuarioEditando = mockUsuario;
    component.nuevoUsuario = {
      email: 'editado@test.com',
      password: '',
      nombre: 'Editado',
      apellido: 'User',
      telefono: '111111',
      rolId: 2,
    };

    mockUsuarioService.editar.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.guardarUsuario();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar usuario');
  });

  it('debería preparar datos para editar usuario', () => {
    component.editarUsuario(mockUsuario);
    expect(component.modoEdicion).toBeTrue();
    expect(component.usuarioEditando).toEqual(mockUsuario);
    expect(component.mostrarModal).toBeTrue();
    expect(component.nuevoUsuario.email).toBe(mockUsuario.email);
  });

  it('debería eliminar un usuario con confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    mockUsuarioService.eliminar.and.returnValue(of(void 0));
    mockUsuarioService.obtenerTodos.and.returnValue(of([]));

    component.eliminarUsuario(mockUsuario);

    expect(mockUsuarioService.eliminar).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith(
      'Usuario eliminado correctamente'
    );
  });

  it('no debería eliminar usuario si se cancela confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarUsuario(mockUsuario);
    expect(mockUsuarioService.eliminar).not.toHaveBeenCalled();
  });

  it('debería manejar error al eliminar usuario', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');
    spyOn(window, 'alert');

    mockUsuarioService.eliminar.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.eliminarUsuario(mockUsuario);

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al eliminar usuario');
  });

  it('debería asignar "" a telefono si no está definido al editar usuario', () => {
    const usuarioSinTelefono = { ...mockUsuario, telefono: undefined };
    component.editarUsuario(usuarioSinTelefono);
    expect(component.nuevoUsuario.telefono).toBe('');
  });
});
