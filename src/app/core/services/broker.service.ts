import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Broker } from '../models/broker.model';

@Injectable({ providedIn: 'root' })
export class BrokerService {
  private readonly baseUrl = 'brokers';

  constructor(private api: ApiService) {}

  getAll(): Observable<Broker[]> {
    return this.api.get<Broker[]>(this.baseUrl);
  }

  getById(id: string): Observable<Broker> {
    return this.api.get<Broker>(`${this.baseUrl}/${id}`);
  }

  create(data: Omit<Broker, 'id'>): Observable<string> {
    return this.api.post<string>(this.baseUrl, data);
  }

  update(id: string, data: Broker): Observable<void> {
    return this.api.put<void>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}
