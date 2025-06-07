import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Operation, OperationType } from '../models/operation.model';

@Injectable({ providedIn: 'root' })
export class OperationService {
  private readonly baseUrl = 'operations';

  constructor(private api: ApiService) {}

  getAll(): Observable<Operation[]> {
    return this.api.get<Operation[]>(this.baseUrl);
  }

  getById(id: string): Observable<Operation> {
    return this.api.get<Operation>(`${this.baseUrl}/${id}`);
  }

  create(operation: Omit<Operation, 'id' | 'totalValue'>): Observable<string> {
    return this.api.post<string>(this.baseUrl, operation);
  }

  update(id: string, operation: Omit<Operation, 'totalValue'>): Observable<void> {
    return this.api.put<void>(`${this.baseUrl}/${id}`, operation);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}
