import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ReembolsoRequest } from '../../models/reembolso-request.model';
import { ReembolsoResponse } from '../../models/reembolso-response.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReembolsoService {
  private apiUrl = 'http://localhost:8080/api/reembolsos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  crearReembolso(reembolso: ReembolsoRequest): Observable<ReembolsoResponse> {
    return this.http.post<ReembolsoResponse>(this.apiUrl, reembolso, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerMisReembolsos(clienteId: number): Observable<ReembolsoResponse[]> {
    return this.http
      .get<ReembolsoResponse[]>(`${this.apiUrl}/cliente/${clienteId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((data) => {
          console.log('Reembolsos cliente:', data);
        })
      );
  }

  obtenerPendientes(): Observable<ReembolsoResponse[]> {
    return this.http.get<ReembolsoResponse[]>(`${this.apiUrl}/pendientes`, {
      headers: this.getAuthHeaders(),
    });
  }

  procesarReembolso(
    id: number,
    aprobar: boolean,
    comentario: string
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/procesar`, null, {
      headers: this.getAuthHeaders(),
      params: {
        aprobar: aprobar.toString(),
        comentario: comentario,
      },
    });
  }
}
