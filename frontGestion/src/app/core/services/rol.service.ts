import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../../models/rol.model';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private baseUrl = 'http://localhost:8082/api/roles';
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }
  
  obtenerTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }
}
