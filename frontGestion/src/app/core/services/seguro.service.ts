import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seguro } from '../../models/seguro.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SeguroService {
  private baseUrl = 'http://localhost:8082/api/seguros';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  crearSeguro(seguro: Omit<Seguro, 'id' | 'creadoPorId'>): Observable<Seguro> {
    return this.http.post<Seguro>(this.baseUrl, seguro, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerSegurosActivos(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.baseUrl}/activos`, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerPorTipo(tipo: 'VIDA' | 'SALUD'): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.baseUrl}/tipo/${tipo}`, {
      headers: this.getAuthHeaders(),
    });
  }

  actualizarEstado(id: number, activo: boolean): Observable<Seguro> {
    return this.http.put<Seguro>(
      `${this.baseUrl}/${id}/estado?activo=${activo}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  obtenerTodosLosSeguros(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }
  editarSeguro(id: number, seguro: Partial<Seguro>): Observable<Seguro> {
    return this.http.put<Seguro>(`${this.baseUrl}/${id}`, seguro, {
      headers: this.getAuthHeaders(),
    });
  }

  eliminarSeguro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
