import { TestBed } from '@angular/core/testing';
import { PagoService } from './pago.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { PagoResponseDTO } from '../../models/pago-response.dto';

describe('PagoService', () => {
  let service: PagoService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const mockHeaders = new HttpHeaders().set(
    'Authorization',
    'Bearer fake-token'
  );

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);
    authServiceSpy.getAuthHeaders.and.returnValue(mockHeaders);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PagoService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service = TestBed.inject(PagoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call crearPago with correct payload and headers', () => {
    const pagoData = {
      contratoId: 1,
      monto: 100,
      metodo: 'efectivo',
      observaciones: 'test',
      estado: 'APROBADO',
      fechaPago: '2024-01-01',
      comprobante: 'base64string',
      comprobanteNombre: 'comprobante.pdf',
      comprobanteTipoContenido: 'application/pdf',
    };

    service.crearPago(pagoData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/pagos');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(req.request.body.metodo).toBe('EFECTIVO');
    req.flush({});
  });

  it('should list all pagos', () => {
    service.listarPagos().subscribe((resp: PagoResponseDTO[]) => {
      expect(resp).toEqual([]);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pagos');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get pago by ID', () => {
    service.obtenerPago(5).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/pagos/5');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should list pagos by contrato', () => {
    service.listarPagosPorContrato(2).subscribe();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/pagos/contrato/2'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should list pagos by cliente', () => {
    service.listarPagosPorCliente(3).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/pagos/cliente/3');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get total pagado', () => {
    service.obtenerTotalPagado(4).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/pagos/total/4');
    expect(req.request.method).toBe('GET');
    req.flush(250);
  });

  it('should generate report between two dates', () => {
    service.generarReporte('2024-01-01', '2024-12-31').subscribe();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/pagos/reporte?fechaInicio=2024-01-01&fechaFin=2024-12-31'
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should revert a pago by ID with motivo', () => {
    service.revertirPago(7, 'Error en el pago').subscribe();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/pagos/7/revertir?motivo=Error en el pago'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });
  it('debería enviar fechaPago como null si no se proporciona', () => {
    const pagoDataSinFecha = {
      contratoId: 1,
      monto: 100,
      metodo: 'efectivo',
      observaciones: 'sin fecha',
      estado: 'APROBADO',
      comprobante: 'base64string',
      comprobanteNombre: 'comprobante.pdf',
      comprobanteTipoContenido: 'application/pdf',
      fechaPago: null, // 👈 Aquí está la clave
    };

    service.crearPago(pagoDataSinFecha).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/pagos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.fechaPago).toBeNull(); // ✅ Se asegura de que vaya como null
    req.flush({});
  });
});
