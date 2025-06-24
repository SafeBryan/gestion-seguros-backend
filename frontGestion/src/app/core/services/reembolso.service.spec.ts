import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReembolsoService } from './reembolso.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { ReembolsoResponse } from '../../models/reembolso-response.model';
import { TestBed } from '@angular/core/testing';

describe('ReembolsoService', () => {
  let service: ReembolsoService;
  let httpMock: HttpTestingController;

  const mockHeaders = new HttpHeaders({ Authorization: 'Bearer fake-token' });

  const authServiceStub = {
    getAuthHeaders: () => mockHeaders,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReembolsoService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    service = TestBed.inject(ReembolsoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('debe crear un reembolso con archivos', () => {
    const formData = new FormData();
    formData.append('file', new Blob(['dummy content']), 'archivo.pdf');

    const responseMock = {
      id: 1,
      estado: 'ENVIADO',
    } as unknown as ReembolsoResponse;

    service.crearReembolsoConArchivos(formData).subscribe((response) => {
      expect(response).toEqual(responseMock);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/reembolsos');
    expect(req.request.method).toBe('POST');
    req.flush(responseMock);
  });
  it('debe obtener reembolsos de un cliente', () => {
    const clienteId = 5;
    const mockData: ReembolsoResponse[] = [
      { id: 1, estado: 'PENDIENTE' },
    ] as any;

    service.obtenerMisReembolsos(clienteId).subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/reembolsos/cliente/${clienteId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  it('debe obtener reembolsos pendientes', () => {
    const mockData: ReembolsoResponse[] = [
      { id: 2, estado: 'PENDIENTE' },
    ] as any;

    service.obtenerPendientes().subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/reembolsos/pendientes'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  it('debe procesar un reembolso', () => {
    const id = 10;
    const aprobar = true;
    const comentario = 'Aprobado por documentación';

    service.procesarReembolso(id, aprobar, comentario).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `http://localhost:8080/api/reembolsos/${id}/procesar`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.params.get('aprobar')).toBe('true');
    expect(req.request.params.get('comentario')).toBe(comentario);
    req.flush(null);
  });
  it('debe obtener reembolsos por cliente (sin headers)', () => {
    const clienteId = 3;
    const mockData: ReembolsoResponse[] = [
      { id: 3, estado: 'APROBADO' },
    ] as any;

    service.obtenerPorCliente(clienteId).subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/reembolsos/cliente/${clienteId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
