import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Seguro } from '../../models/seguro.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SeguroService {
  private baseUrl = 'http://localhost:8080/api/seguros';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  private handleError(error: any) {
    console.error('Error en SeguroService:', error);
    
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida. Verifique los datos ingresados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicie sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'No tiene permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado.';
          break;
        case 409:
          errorMessage = 'El recurso ya existe o hay un conflicto.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Crear un nuevo seguro
   * @param seguro - Datos del seguro a crear (sin ID)
   * @returns Observable<Seguro>
   */
  crearSeguro(seguro: Omit<Seguro, 'id'>): Observable<Seguro> {
    return this.http.post<Seguro>(this.baseUrl, seguro, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los seguros del usuario autenticado
   * @returns Observable<Seguro[]>
   */
  obtenerTodosLosSeguros(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener solo los seguros activos
   * @returns Observable<Seguro[]>
   */
  obtenerSegurosActivos(): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.baseUrl}/activos`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener seguros por tipo (VIDA o SALUD)
   * @param tipo - Tipo de seguro
   * @returns Observable<Seguro[]>
   */
  obtenerPorTipo(tipo: 'VIDA' | 'SALUD'): Observable<Seguro[]> {
    return this.http.get<Seguro[]>(`${this.baseUrl}/tipo/${tipo}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un seguro específico por ID
   * @param id - ID del seguro
   * @returns Observable<Seguro>
   */
  obtenerSeguroPorId(id: number): Observable<Seguro> {
    return this.http.get<Seguro>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Editar un seguro existente
   * @param id - ID del seguro a editar
   * @param seguro - Datos actualizados del seguro
   * @returns Observable<Seguro>
   */
  editarSeguro(id: number, seguro: Partial<Seguro>): Observable<Seguro> {
    return this.http.put<Seguro>(`${this.baseUrl}/${id}`, seguro, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar el estado (activo/inactivo) de un seguro
   * @param id - ID del seguro
   * @param activo - Nuevo estado del seguro
   * @returns Observable<Seguro>
   */
  actualizarEstado(id: number, activo: boolean): Observable<Seguro> {
    return this.http.put<Seguro>(
      `${this.baseUrl}/${id}/estado?activo=${activo}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar permanentemente un seguro
   * @param id - ID del seguro a eliminar
   * @returns Observable<void>
   */
  eliminarSeguro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener estadísticas de seguros
   * @returns Observable con estadísticas básicas
   */
  obtenerEstadisticas(): Observable<{
    total: number;
    activos: number;
    inactivos: number;
    porTipo: { VIDA: number; SALUD: number };
  }> {
    return this.http.get<{
      total: number;
      activos: number;
      inactivos: number;
      porTipo: { VIDA: number; SALUD: number };
    }>(`${this.baseUrl}/estadisticas`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar seguros por nombre o descripción
   * @param termino - Término de búsqueda
   * @returns Observable<Seguro[]>
   */
  buscarSeguros(termino: string): Observable<Seguro[]> {
    if (!termino.trim()) {
      return this.obtenerTodosLosSeguros();
    }
    
    return this.http.get<Seguro[]>(`${this.baseUrl}/buscar?q=${encodeURIComponent(termino)}`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Duplicar un seguro existente
   * @param id - ID del seguro a duplicar
   * @returns Observable<Seguro>
   */
  duplicarSeguro(id: number): Observable<Seguro> {
    return this.http.post<Seguro>(`${this.baseUrl}/${id}/duplicar`, {}, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Activar múltiples seguros
   * @param ids - Array de IDs de seguros a activar
   * @returns Observable<Seguro[]>
   */
  activarMultiplesSeguros(ids: number[]): Observable<Seguro[]> {
    return this.http.put<Seguro[]>(`${this.baseUrl}/activar-multiples`, { ids }, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Desactivar múltiples seguros
   * @param ids - Array de IDs de seguros a desactivar
   * @returns Observable<Seguro[]>
   */
  desactivarMultiplesSeguros(ids: number[]): Observable<Seguro[]> {
    return this.http.put<Seguro[]>(`${this.baseUrl}/desactivar-multiples`, { ids }, {
      headers: this.getAuthHeaders(),
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}