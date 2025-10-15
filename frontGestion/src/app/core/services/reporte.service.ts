import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private baseUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  getSegurosImpagos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/seguros-impagos`);
  }

  getContratosPorCliente(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contratos-por-cliente/${id}`);
  }

  getReembolsosPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reembolsos-pendientes`);
  }

  getContratosVencidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contratos-vencidos`);
  }

  getContratosPorVencer(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/contratos-por-vencer`);
  }
}
