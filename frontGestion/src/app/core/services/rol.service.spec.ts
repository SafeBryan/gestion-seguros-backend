import { TestBed } from '@angular/core/testing';
import { RolService } from './rol.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { Rol } from '../../models/rol.model';

describe('RolService', () => {
  let service: RolService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockHeaders = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    authSpy.getAuthHeaders.and.returnValue(mockHeaders as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolService, { provide: AuthService, useValue: authSpy }],
    });

    service = TestBed.inject(RolService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los roles (GET)', () => {
    const mockRoles: Rol[] = [
      { id: 1, nombre: 'ADMIN' },
      { id: 2, nombre: 'USER' },
    ];

    service.obtenerTodos().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].nombre).toBe('ADMIN');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/roles');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush(mockRoles);
  });

  it('debería manejar errores y retornar [] si falla', () => {
    service.obtenerTodos().subscribe((res) => {
      expect(res).toEqual([]); // Confirmamos que devuelve un array vacío
    });

    const req = httpMock.expectOne('http://localhost:8080/api/roles');
    req.flush('Falló el servidor', { status: 500, statusText: 'Server Error' });
  });
});
