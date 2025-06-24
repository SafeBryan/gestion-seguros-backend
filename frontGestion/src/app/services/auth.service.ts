import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { UserProfile } from '../models/profile-user.interface';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  id: number;
  nombre: string;
  apellido: string;
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenUserProfile = 'UserProfile';
  private tokenKey = 'jwtToken';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      this.loggedIn.next(this.hasToken());
    }
  }

  // Login method
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (this.isBrowser()) {
            localStorage.setItem(this.tokenKey, response.token);

            // Decodificamos el token para obtener datos del usuario
            const decoded = jwtDecode<any>(response.token);

            const userProfile: UserProfile = {
              id: decoded.id,
              nombre: decoded.nombre,
              apellido: decoded.apellido,
              roles: decoded.roles,
              token: response.token,
            };

            localStorage.setItem(
              this.tokenUserProfile,
              JSON.stringify(userProfile)
            );
            this.loggedIn.next(true);
          }
        })
      );
  }

  // Logout method
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    }
  }

  // Get token from localStorage
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  // Returns an observable for the logged in state
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  
// auth.service.ts
getAuthHeaders(): HttpHeaders {
  const token = this.getToken(); // Asume que tienes un método para obtener el token
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
}

  // Get user ID from decoded JWT
  getUsuarioId(): number {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token no encontrado');
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token decodificado:', decoded);

      if (typeof decoded.id !== 'number') {
        throw new Error('ID de usuario no válido en el token');
      }

      return decoded.id;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      throw new Error('Token inválido');
    }
  }

  getUsuarioPerfil(): UserProfile | null {
    if (this.isBrowser()) {
      const userProfile = localStorage.getItem(this.tokenUserProfile);
      return userProfile ? JSON.parse(userProfile) : null;
    }
    return null;
  }

  // Check if the token exists in localStorage
  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem(this.tokenKey);
  }

  // Check if the environment is a browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
