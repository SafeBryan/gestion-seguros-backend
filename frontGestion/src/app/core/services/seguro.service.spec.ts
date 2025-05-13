import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
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
      providers: [SeguroService, { provide: AuthService, useValue: authSpy }],
    });

    service = TestBed.inject(SeguroService);
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

  it('debería crear un seguro', () => {
    const mockSeguro: Seguro = {
      id: 1, // ✅ agregado
      nombre: 'Seguro Vida',
      tipo: 'VIDA',
      descripcion: 'Cobertura completa para vida',
      cobertura: 'Muerte accidental y natural',
      precioAnual: 500.0,
      activo: true,
    };

    service.crearSeguro(mockSeguro).subscribe((res) => {
      expect(res).toEqual(mockSeguro);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros');
    expect(req.request.method).toBe('POST');
    req.flush(mockSeguro);
  });

  it('debería obtener seguros por tipo', () => {
    const mockSeguros: Seguro[] = [
      {
        id: 1, // ✅ agregado
        nombre: 'Seguro 1',
        tipo: 'SALUD',
        descripcion: 'Cobertura médica básica',
        cobertura: 'Consultas, emergencias',
        precioAnual: 300,
        activo: true,
      },
      {
        id: 2, // ✅ agregado
        nombre: 'Seguro 2',
        tipo: 'SALUD',
        descripcion: 'Cobertura extendida',
        cobertura: 'Hospitalización',
        precioAnual: 400,
        activo: true,
      },
    ];

    service.obtenerPorTipo('SALUD').subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res).toEqual(mockSeguros);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/tipo/SALUD'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockSeguros);
  });

  it('debería obtener seguros activos', () => {
    const mockSeguros: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro Activo',
        tipo: 'VIDA',
        descripcion: 'Cobertura total',
        cobertura: 'Todo riesgo',
        precioAnual: 700,
        activo: true,
      },
    ];

    service.obtenerSegurosActivos().subscribe((res) => {
      expect(res).toEqual(mockSeguros);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros/activos');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeguros);
  });

  it('debería actualizar el estado de un seguro', () => {
    const seguroActualizado: Seguro = {
      id: 1,
      nombre: 'Seguro Salud',
      tipo: 'SALUD',
      descripcion: 'Cobertura parcial',
      cobertura: 'Emergencias',
      precioAnual: 400,
      activo: false,
    };

    service.actualizarEstado(1, false).subscribe((res) => {
      expect(res).toEqual(seguroActualizado);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/1/estado?activo=false'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(seguroActualizado);
  });

  it('debería obtener todos los seguros', () => {
    const mockSeguros: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro General',
        tipo: 'VIDA',
        descripcion: 'Básico',
        cobertura: 'Muerte natural',
        precioAnual: 250,
        activo: true,
      },
    ];

    service.obtenerTodosLosSeguros().subscribe((res) => {
      expect(res).toEqual(mockSeguros);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeguros);
  });

  it('debería editar un seguro', () => {
    const seguroEditado: Seguro = {
      id: 1,
      nombre: 'Seguro Editado',
      tipo: 'VIDA',
      descripcion: 'Modificado',
      cobertura: 'Nueva cobertura',
      precioAnual: 600,
      activo: true,
    };

    const datosParciales = { nombre: 'Seguro Editado', precioAnual: 600 };

    service.editarSeguro(1, datosParciales).subscribe((res) => {
      expect(res).toEqual(seguroEditado);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(datosParciales);
    req.flush(seguroEditado);
  });

  it('debería eliminar un seguro', () => {
    service.eliminarSeguro(1).subscribe((res) => {
      expect(res).toBeNull(); // porque retorna void
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // respuesta vacía del backend
  });
});
