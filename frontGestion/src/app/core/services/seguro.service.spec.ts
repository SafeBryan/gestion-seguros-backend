// import { TestBed } from '@angular/core/testing';

// import { SeguroService } from './seguro.service';

// describe('SeguroService', () => {
//   let service: SeguroService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(SeguroService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SeguroService } from './seguro.service';
import { AuthService } from '../../services/auth.service';
import { Seguro } from '../../models/seguro.model';
import { HttpHeaders } from '@angular/common/http';

describe('SeguroService', () => {
  let service: SeguroService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SeguroService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(SeguroService);
    httpMock = TestBed.inject(HttpTestingController);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockAuthService.getAuthHeaders.and.returnValue(new HttpHeaders());
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería crear un seguro', () => {
    const mockSeguro: Seguro = {
      nombre: 'Seguro Vida',
      tipo: 'VIDA',
      descripcion: 'Cobertura completa para vida',
      cobertura: 'Muerte accidental y natural',
      precioAnual: 500.00,
      activo: true
    };

    service.crearSeguro(mockSeguro).subscribe(res => {
      expect(res).toEqual(mockSeguro);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/seguros');
    expect(req.request.method).toBe('POST');
    req.flush(mockSeguro);
  });

  it('debería obtener seguros por tipo', () => {
    const mockSeguros: Seguro[] = [
      {
        nombre: 'Seguro 1',
        tipo: 'SALUD',
        descripcion: 'Cobertura médica básica',
        cobertura: 'Consultas, emergencias',
        precioAnual: 300,
        activo: true
      },
      {
        nombre: 'Seguro 2',
        tipo: 'SALUD',
        descripcion: 'Cobertura extendida',
        cobertura: 'Hospitalización',
        precioAnual: 400,
        activo: true
      }
    ];

    service.obtenerPorTipo('SALUD').subscribe(res => {
      expect(res.length).toBe(2);
      expect(res).toEqual(mockSeguros);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/seguros/tipo/SALUD');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeguros);
  });
});