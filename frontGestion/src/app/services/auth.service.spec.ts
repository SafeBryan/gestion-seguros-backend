import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJpZCI6MSwicm9sIjoiQURNSU4iLCJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjk1NjAwMDAwLCJleHAiOjE3MDAwMDAwMDB9.' +
    's3Kr5KAcWPHvE64ZBYtNmJ2zHVxAEUjZbS-sTGkFqXA';

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar sesión correctamente y guardar el token', () => {
    const credentials = { email: 'test@test.com', password: '123456' };

    service.login(credentials).subscribe((res) => {
      expect(res.token).toBe(mockToken);
      expect(localStorage.getItem('jwtToken')).toBe(mockToken);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: mockToken });
  });

  it('debería cerrar sesión y eliminar el token', () => {
    localStorage.setItem('jwtToken', mockToken);
    service.logout();

    expect(localStorage.getItem('jwtToken')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería retornar headers con token', () => {
    localStorage.setItem('jwtToken', mockToken);
    const headers = service.getAuthHeaders();

    expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('debería obtener el ID del usuario desde el token', () => {
    localStorage.setItem('jwtToken', mockToken);
    const id = service.getUsuarioId();

    expect(id).toBe(1);
  });

  it('debería lanzar error si no hay token en getUsuarioId', () => {
    expect(() => service.getUsuarioId()).toThrowError('Token no encontrado');
  });

  it('debería retornar observable de estado de login', (done) => {
    localStorage.setItem('jwtToken', mockToken);

    service = new AuthService(TestBed.inject(HttpClient), routerSpy);

    service.isLoggedIn().subscribe((loggedIn) => {
      expect(loggedIn).toBeTrue();
      done();
    });
  });
});
