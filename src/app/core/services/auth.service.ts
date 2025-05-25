import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private readonly apiUrl = 'https://localhost:5001/v1'; // ajuste para sua base real

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => localStorage.setItem(this.tokenKey, response.token)),
        map(() => {}) // transforma em Observable<void>
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
