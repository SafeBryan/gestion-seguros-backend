import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

export interface RegistroDTO {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  rolId: number;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  obtenerPorRol(rolNombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/rol/${rolNombre}`, {
      headers: this.getAuthHeaders(),
    });
  }

  actualizarEstado(id: number, activo: boolean): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.baseUrl}/${id}/estado?activo=${activo}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  crear(usuario: RegistroDTO): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario, {
      headers: this.getAuthHeaders(),
    });
  }
  editar(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario, {
      headers: this.getAuthHeaders(),
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
