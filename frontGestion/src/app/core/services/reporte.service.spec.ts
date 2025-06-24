import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReporteService } from './reporte.service';

describe('ReporteService', () => {
  let service: ReporteService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/reportes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReporteService],
    });

    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch seguros impagos', () => {
    const mockResponse = [{ id: 1, nombre: 'Seguro 1' }];
    service.getSegurosImpagos().subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/seguros-impagos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch contratos por cliente', () => {
    const clienteId = 5;
    const mockResponse = [{ id: 10, contrato: 'ABC123' }];
    service.getContratosPorCliente(clienteId).subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/contratos-por-cliente/5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch reembolsos pendientes', () => {
    const mockResponse = [{ id: 2, monto: 150 }];
    service.getReembolsosPendientes().subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/reembolsos-pendientes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch contratos vencidos', () => {
    const mockResponse = [{ id: 3, contrato: 'XYZ789' }];
    service.getContratosVencidos().subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/contratos-vencidos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch contratos por vencer', () => {
    const mockResponse = [{ id: 4, contrato: 'LMN456' }];
    service.getContratosPorVencer().subscribe((resp) => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/contratos-por-vencer`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
