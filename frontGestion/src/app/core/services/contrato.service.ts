import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrato } from '../../models/contrato.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContratoService {
  private baseUrl = 'http://localhost:8082/api/contratos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  crearContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.baseUrl, contrato, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerPorCliente(clienteId: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}/cliente/${clienteId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerContratosPorVencer(dias: number): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(
      `${this.baseUrl}/por-vencer?dias=${dias}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  actualizarEstado(
    id: number,
    estado: 'ACTIVO' | 'VENCIDO' | 'CANCELADO'
  ): Observable<Contrato> {
    return this.http.put<Contrato>(
      `${this.baseUrl}/${id}/estado?estado=${estado}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  actualizarContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.baseUrl}/${contrato.id}`, contrato, {
      headers: this.getAuthHeaders(),
    });
  }
}
