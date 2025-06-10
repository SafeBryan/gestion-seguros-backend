import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoRequestDTO } from '../../models/pago-request.dto';
import { PagoResponseDTO } from '../../models/pago-response.dto';

import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

// pago.service.ts
crearPago(pagoData: any): Observable<any> {
  // Asegurar que los nombres de campos coincidan con el DTO del backend
  const payload = {
    contratoId: pagoData.contratoId,
    monto: pagoData.monto,
    metodo: pagoData.metodo.toUpperCase().replace('É', 'E'), // Ajustar para coincidir con el enum
    observaciones: pagoData.observaciones,
    estado: pagoData.estado,
    fechaPago: pagoData.fechaPago ? new Date(pagoData.fechaPago).toISOString() : null,
    comprobante: pagoData.comprobante, // Cambiar nombre para que coincida con el DTO
    comprobanteNombre: pagoData.comprobanteNombre,
    comprobanteTipoContenido: pagoData.comprobanteTipoContenido
  };

  return this.http.post(this.apiUrl, payload, {
    headers: this.getAuthHeaders().set('Content-Type', 'application/json')
  });
}

  listarPagos(): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerPago(id: number): Observable<PagoResponseDTO> {
    return this.http.get<PagoResponseDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  listarPagosPorContrato(contratoId: number): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(`${this.apiUrl}/contrato/${contratoId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  listarPagosPorCliente(clienteId: number): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(`${this.apiUrl}/cliente/${clienteId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerTotalPagado(contratoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${contratoId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  generarReporte(fechaInicio: string, fechaFin: string): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(
      `${this.apiUrl}/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
      { headers: this.getAuthHeaders() }
    );
  }

  revertirPago(id: number, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/revertir?motivo=${motivo}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }
}

 