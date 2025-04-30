import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seguro } from '../../models/seguro.model';
import { AuthService } from '../../services/auth.service'; // Asegúrate de importar el AuthService

@Injectable({
  providedIn: 'root'
})
export class SeguroService {
  private baseUrl = 'http://localhost:8082/api/seguros';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener los encabezados de autorización del AuthService
  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Método para crear un seguro
  crearSeguro(seguro: Seguro): Observable<Seguro> {
    return this.http.post<Seguro>(this.baseUrl, seguro, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener seguros activos
  obtenerSegurosActivos(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener seguros por tipo (VIDA o SALUD)
  obtenerPorTipo(tipo: 'VIDA' | 'SALUD'): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.baseUrl}/tipo/${tipo}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar el estado de un seguro
  actualizarEstado(id: number, activo: boolean): Observable<Seguro> {
    return this.http.put<Seguro>(`${this.baseUrl}/${id}/estado?activo=${activo}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
