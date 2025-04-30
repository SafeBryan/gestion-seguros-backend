import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/auth';
  private tokenKey = 'jwtToken';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser()) {
      this.loggedIn.next(this.hasToken());
    }
  }

  // Login method
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (this.isBrowser()) {
          localStorage.setItem(this.tokenKey, response.token);
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

  // Generate Authorization header with token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`);
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
