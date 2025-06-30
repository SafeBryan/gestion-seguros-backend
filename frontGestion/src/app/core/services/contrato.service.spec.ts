import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ContratoService } from './contrato.service';
import { AuthService } from '../../services/auth.service';
import { Contrato } from '../../models/contrato.model';

describe('ContratoService', () => {
  let service: ContratoService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockHeaders = { Authorization: 'Bearer test-token' };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    authSpy.getAuthHeaders.and.returnValue(mockHeaders as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContratoService, { provide: AuthService, useValue: authSpy }],
    });

    service = TestBed.inject(ContratoService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear un contrato (POST)', () => {
    const mockContrato = { id: 1, clienteId: 1 } as Contrato;

    service.crearContrato(mockContrato).subscribe((res) => {
      expect(res).toEqual(mockContrato);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/contratos');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContrato);
  });

  it('debería obtener contratos por cliente (GET)', () => {
    const clienteId = 5;
    const mockContratos = [{ id: 1 }, { id: 2 }] as Contrato[];

    service.obtenerPorCliente(clienteId).subscribe((res) => {
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/contratos/cliente/${clienteId}?todos=true`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContratos);
  });

  it('debería obtener contratos por vencer (GET)', () => {
    const dias = 10;
    const mockContratos = [{ id: 3 }] as Contrato[];

    service.obtenerContratosPorVencer(dias).subscribe((res) => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/contratos/por-vencer?dias=${dias}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContratos);
  });

  it('debería actualizar el estado de un contrato (PUT)', () => {
    const id = 7;
    const estado = 'ACTIVO';
    const mockContrato = { id, estado } as Contrato;

    service.actualizarEstado(id, estado).subscribe((res) => {
      expect(res.estado).toBe(estado);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/contratos/${id}/estado?estado=${estado}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContrato);
  });

  it('debería actualizar un contrato (PUT)', () => {
    const contrato = { id: 9, clienteId: 3 } as Contrato;

    service.actualizarContrato(contrato).subscribe((res) => {
      expect(res.id).toBe(9);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/contratos/9`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(contrato);
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(contrato);
  });
  it('debería obtener contrato por ID (GET)', () => {
    const contratoId = 1;
    const mockContrato = { id: contratoId, clienteId: 2 } as Contrato;

    service.obtenerPorId(contratoId).subscribe((res) => {
      expect(res).toEqual(mockContrato);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/contratos/${contratoId}`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContrato);
  });

  it('debería obtener contratos aceptados por cliente (GET)', () => {
    const clienteId = 5;
    const mockContratos = [{ id: 1 }, { id: 2 }] as Contrato[];

    service.obtenerAceptadosPorCliente(clienteId).subscribe((res) => {
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/contratos/cliente/${clienteId}/aceptados`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContratos);
  });
  it('debería obtener todos los contratos del usuario (GET)', () => {
    const mockContratos = [{ id: 1 }, { id: 2 }] as Contrato[];

    service.obtenerTodosLosContratos().subscribe((res) => {
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/contratos`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContratos);
  });
  it('debería obtener todos los contratos (GET)', () => {
    const mockContratos = [{ id: 1 }] as Contrato[];

    service.obtenerTodos().subscribe((res) => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/contratos`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockContratos);
  });
});
