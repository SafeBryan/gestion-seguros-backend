import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClienteRequestDTO } from '../../models/cliente-request.dto';
import { ClienteResponseDTO } from '../../models/cliente-response.dto';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  crearCliente(cliente: ClienteRequestDTO): Observable<ClienteResponseDTO> {
    return this.http.post<ClienteResponseDTO>(this.apiUrl, cliente);
  }

  listarClientes(): Observable<ClienteResponseDTO[]> {
    return this.http.get<ClienteResponseDTO[]>(this.apiUrl);
  }

  obtenerCliente(id: number): Observable<ClienteResponseDTO> {
    return this.http.get<ClienteResponseDTO>(`${this.apiUrl}/${id}`);
  }

  actualizarCliente(
    id: number,
    cliente: ClienteRequestDTO
  ): Observable<ClienteResponseDTO> {
    return this.http.put<ClienteResponseDTO>(`${this.apiUrl}/${id}`, cliente);
  }

  desactivarCliente(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/desactivar`, {});
  }
}
