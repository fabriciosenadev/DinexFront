import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'https://localhost:5001/v1';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${path}`, {
        params: this.buildParams(params),
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .patch<T>(`${this.apiUrl}/${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, headers?: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${path}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }

  private handleError(error: any) {
    // Aqui você pode logar, redirecionar ou exibir erro global
    return throwError(() => error);
  }
}
