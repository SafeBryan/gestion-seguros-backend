// Actualización del ContratoService para asegurar que se devuelven todos los contratos sin filtrar

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Contrato } from '../../models/contrato.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContratoService {
  private baseUrl = 'http://localhost:8080/api/contratos';

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
    // Asegurarnos de que estamos solicitando todos los contratos sin filtrar por estado
    return this.http.get<Contrato[]>(`${this.baseUrl}/cliente/${clienteId}?todos=true`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap((data) => {
        console.log('Cliente ID:', clienteId);
        console.log('Contratos obtenidos desde service:', data);
      })
    );
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
    estado: 'ACTIVO' | 'VENCIDO' | 'CANCELADO' | 'RECHAZADO'  | 'ACEPTADO'
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

  obtenerTodosLosContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
