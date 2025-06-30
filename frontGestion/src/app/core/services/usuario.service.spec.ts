import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UsuarioService, RegistroDTO } from './usuario.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService, { provide: AuthService, useValue: authSpy }],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los usuarios', () => {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        email: 'admin@test.com',
        nombre: 'Admin',
        apellido: 'Root',
        telefono: '123456789',
        rolId: 1,
        rolNombre: 'ADMIN',
        activo: true,
      },
    ];

    service.obtenerTodos().subscribe((res) => {
      expect(res).toEqual(mockUsuarios);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });

  it('debería obtener usuarios por rol', () => {
    const mockUsuarios: Usuario[] = [
      {
        id: 2,
        email: 'cliente@test.com',
        nombre: 'Cliente',
        apellido: 'Normal',
        telefono: '987654321',
        rolId: 2,
        rolNombre: 'CLIENTE',
        activo: true,
      },
    ];

    service.obtenerPorRol('CLIENTE').subscribe((res) => {
      expect(res).toEqual(mockUsuarios);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/usuarios/rol/CLIENTE'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuarios);
  });

  it('debería actualizar el estado del usuario', () => {
    const updatedUser: Usuario = {
      id: 3,
      email: 'usuario@test.com',
      nombre: 'Usuario',
      apellido: 'Apagado',
      telefono: '000111222',
      rolId: 2,
      rolNombre: 'CLIENTE',
      activo: false,
    };

    service.actualizarEstado(3, false).subscribe((res) => {
      expect(res).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/usuarios/3/estado?activo=false'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(updatedUser);
  });

  it('debería crear un usuario', () => {
    const nuevo: RegistroDTO = {
      email: 'nuevo@correo.com',
      password: '123456',
      nombre: 'Nuevo',
      apellido: 'Usuario',
      telefono: '123456789',
      rolId: 1,
    };

    const creado: Usuario = {
      id: 4,
      email: nuevo.email,
      nombre: nuevo.nombre,
      apellido: nuevo.apellido,
      telefono: nuevo.telefono,
      rolId: nuevo.rolId,
      rolNombre: 'ADMIN',
      activo: true,
    };

    service.crear(nuevo).subscribe((res) => {
      expect(res).toEqual(creado);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevo);
    req.flush(creado);
  });

  it('debería editar un usuario', () => {
    const cambios: Partial<Usuario> = {
      nombre: 'Editado',
      telefono: '111222333',
    };

    const actualizado: Usuario = {
      id: 5,
      email: 'editado@test.com',
      nombre: 'Editado',
      apellido: 'Usuario',
      telefono: '111222333',
      rolId: 2,
      rolNombre: 'CLIENTE',
      activo: true,
    };

    service.editar(5, cambios).subscribe((res) => {
      expect(res).toEqual(actualizado);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);
    req.flush(actualizado);
  });

  it('debería eliminar un usuario', () => {
    service.eliminar(6).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/usuarios/6');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
