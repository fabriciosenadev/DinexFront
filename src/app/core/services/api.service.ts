import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'https://localhost:5001/v1';

  constructor(private http: HttpClient) {}

  get<T>(path: string) {
    return this.http.get<T>(`${this.apiUrl}/${path}`);
  }

  post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }

  put<T>(path: string, body: any) {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.apiUrl}/${path}`);
  }
}
