import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { ClienteRequestDTO } from '../../models/cliente-request.dto';
import { ClienteResponseDTO } from '../../models/cliente-response.dto';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService],
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('debe crear un cliente', () => {
    const clienteRequest: ClienteRequestDTO = { nombre: 'Juan' } as any;
    const clienteResponse: ClienteResponseDTO = {
      id: 1,
      nombre: 'Juan',
    } as any;

    service.crearCliente(clienteRequest).subscribe((response) => {
      expect(response).toEqual(clienteResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/clientes');
    expect(req.request.method).toBe('POST');
    req.flush(clienteResponse);
  });
  it('debe obtener un cliente por ID', () => {
    const clienteId = 1;
    const clienteResponse: ClienteResponseDTO = {
      id: 1,
      nombre: 'Juan',
    } as any;

    service.obtenerCliente(clienteId).subscribe((response) => {
      expect(response).toEqual(clienteResponse);
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/clientes/${clienteId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(clienteResponse);
  });
  it('debe actualizar un cliente', () => {
    const clienteId = 1;
    const clienteRequest: ClienteRequestDTO = { nombre: 'Pedro' } as any;
    const clienteResponse: ClienteResponseDTO = {
      id: 1,
      nombre: 'Pedro',
    } as any;

    service
      .actualizarCliente(clienteId, clienteRequest)
      .subscribe((response) => {
        expect(response).toEqual(clienteResponse);
      });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/clientes/${clienteId}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(clienteResponse);
  });
  it('debe desactivar un cliente', () => {
    const clienteId = 1;

    service.desactivarCliente(clienteId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(
      `http://localhost:8080/api/clientes/${clienteId}/desactivar`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('debe listar todos los clientes', () => {
    const clientesResponse: ClienteResponseDTO[] = [
      { id: 1, nombre: 'Juan' },
      { id: 2, nombre: 'Ana' },
    ] as any;

    service.listarClientes().subscribe((response) => {
      expect(response.length).toBe(2);
      expect(response).toEqual(clientesResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/clientes');
    expect(req.request.method).toBe('GET');
    req.flush(clientesResponse);
  });
});
