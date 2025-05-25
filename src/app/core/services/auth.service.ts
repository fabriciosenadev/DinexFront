import { Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'dinex::token';

  constructor(private api: ApiService) {}

  login(email: string, password: string): Observable<void> {
    return this.api
      .post<{ token: string }>('users/login', { email, password })
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
