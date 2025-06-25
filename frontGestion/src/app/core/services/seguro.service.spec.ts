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

  it('debería manejar error 404 en obtenerSeguroPorId', (done) => {
    const errorMessage = 'El recurso solicitado no fue encontrado.';

    service.obtenerSeguroPorId(999).subscribe({
      next: () => {
        fail('Debería haber fallado con error 404');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    // Primer intento fallido (retry lo reintenta)
    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/999');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 404, statusText: 'Not Found' });

    // Segundo intento (retry)
    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/999');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('debería obtener estadísticas de seguros', () => {
    const estadisticas = {
      total: 10,
      activos: 7,
      inactivos: 3,
      porTipo: { VIDA: 6, SALUD: 4 },
    };

    service.obtenerEstadisticas().subscribe((res) => {
      expect(res).toEqual(estadisticas);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/estadisticas'
    );
    expect(req.request.method).toBe('GET');
    req.flush(estadisticas);
  });
  it('debería buscar seguros por término', () => {
    const termino = 'vida';
    const resultados: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro Vida',
        tipo: 'VIDA',
        descripcion: 'Protección total',
        cobertura: 'Cobertura vida',
        precioAnual: 500,
        activo: true,
      },
    ];

    service.buscarSeguros(termino).subscribe((res) => {
      expect(res).toEqual(resultados);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/seguros/buscar?q=vida`
    );
    expect(req.request.method).toBe('GET');
    req.flush(resultados);
  });
  it('debería duplicar un seguro', () => {
    const seguroDuplicado: Seguro = {
      id: 2,
      nombre: 'Seguro Duplicado',
      tipo: 'VIDA',
      descripcion: 'Duplicado',
      cobertura: 'Cobertura',
      precioAnual: 500,
      activo: true,
    };

    service.duplicarSeguro(1).subscribe((res) => {
      expect(res).toEqual(seguroDuplicado);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/1/duplicar'
    );
    expect(req.request.method).toBe('POST');
    req.flush(seguroDuplicado);
  });

  it('debería activar múltiples seguros', () => {
    const ids = [1, 2];
    const seguros: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro 1',
        tipo: 'VIDA',
        descripcion: '',
        cobertura: '',
        precioAnual: 100,
        activo: true,
      },
      {
        id: 2,
        nombre: 'Seguro 2',
        tipo: 'VIDA',
        descripcion: '',
        cobertura: '',
        precioAnual: 200,
        activo: true,
      },
    ];

    service.activarMultiplesSeguros(ids).subscribe((res) => {
      expect(res).toEqual(seguros);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/activar-multiples'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ ids });
    req.flush(seguros);
  });

  it('debería desactivar múltiples seguros', () => {
    const ids = [1, 2];
    const seguros: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro 1',
        tipo: 'VIDA',
        descripcion: '',
        cobertura: '',
        precioAnual: 100,
        activo: false,
      },
      {
        id: 2,
        nombre: 'Seguro 2',
        tipo: 'VIDA',
        descripcion: '',
        cobertura: '',
        precioAnual: 200,
        activo: false,
      },
    ];

    service.desactivarMultiplesSeguros(ids).subscribe((res) => {
      expect(res).toEqual(seguros);
    });

    const req = httpMock.expectOne(
      'http://localhost:8080/api/seguros/desactivar-multiples'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ ids });
    req.flush(seguros);
  });

  it('debería manejar error 400 (Solicitud inválida)', (done) => {
    const errorMessage = 'Solicitud inválida. Verifique los datos ingresados.';

    service.obtenerSeguroPorId(1).subscribe({
      next: () => {
        fail('Debería haber fallado con error 400');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 400, statusText: 'Bad Request' });

    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 400, statusText: 'Bad Request' });
  });
  it('debería manejar error 401 (No autorizado)', (done) => {
    const errorMessage = 'No autorizado. Inicie sesión nuevamente.';

    service.obtenerSeguroPorId(1).subscribe({
      next: () => {
        fail('Debería haber fallado con error 401');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 401, statusText: 'Unauthorized' });

    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 401, statusText: 'Unauthorized' });
  });
  it('debería manejar error 403 (Prohibido)', (done) => {
    const errorMessage = 'No tiene permisos para realizar esta acción.';

    service.obtenerSeguroPorId(1).subscribe({
      next: () => {
        fail('Debería haber fallado con error 403');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 403, statusText: 'Forbidden' });

    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 403, statusText: 'Forbidden' });
  });
  it('debería manejar error 409 (Conflicto)', (done) => {
    const errorMessage = 'El recurso ya existe o hay un conflicto.';

    service.obtenerSeguroPorId(1).subscribe({
      next: () => {
        fail('Debería haber fallado con error 409');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 409, statusText: 'Conflict' });

    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 409, statusText: 'Conflict' });
  });
  it('debería manejar error 500 (Error interno del servidor)', (done) => {
    const errorMessage = 'Error interno del servidor. Intente más tarde.';

    service.obtenerSeguroPorId(1).subscribe({
      next: () => {
        fail('Debería haber fallado con error 500');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
        done();
      },
    });

    const req1 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req1.request.method).toBe('GET');
    req1.flush({}, { status: 500, statusText: 'Internal Server Error' });

    const req2 = httpMock.expectOne('http://localhost:8080/api/seguros/1');
    expect(req2.request.method).toBe('GET');
    req2.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
  it('debería devolver todos los seguros si el término de búsqueda está vacío', () => {
    const mockSeguros: Seguro[] = [
      {
        id: 1,
        nombre: 'Seguro General',
        tipo: 'VIDA',
        descripcion: 'Básico',
        cobertura: 'Cobertura completa',
        precioAnual: 200,
        activo: true,
      },
    ];

    service.buscarSeguros('  ').subscribe((res) => {
      expect(res).toEqual(mockSeguros);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/seguros');
    expect(req.request.method).toBe('GET');
    req.flush(mockSeguros);
  });
});
