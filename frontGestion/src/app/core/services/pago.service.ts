import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagoRequestDTO } from '../../models/pago-request.dto';
import { PagoResponseDTO } from '../../models/pago-response.dto';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) {}

  crearPago(pago: PagoRequestDTO): Observable<PagoResponseDTO> {
    return this.http.post<PagoResponseDTO>(this.apiUrl, pago);
  }

  listarPagos(): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(this.apiUrl);
  }

  obtenerPago(id: number): Observable<PagoResponseDTO> {
    return this.http.get<PagoResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listarPagosPorContrato(contratoId: number): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(`${this.apiUrl}/contrato/${contratoId}`);
  }

  listarPagosPorCliente(clienteId: number): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  obtenerTotalPagado(contratoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${contratoId}`);
  }

  generarReporte(fechaInicio: string, fechaFin: string): Observable<PagoResponseDTO[]> {
    return this.http.get<PagoResponseDTO[]>(
      `${this.apiUrl}/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  revertirPago(id: number, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/revertir?motivo=${motivo}`, {});
  }
}
 