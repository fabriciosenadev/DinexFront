import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../models/asset.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private readonly baseUrl = 'Assets';

  constructor(private api: ApiService) { }

  getAll(): Observable<Asset[]> {
    return this.api.get<Asset[]>(this.baseUrl);
  }

  getById(id: string): Observable<Asset> {
    return this.api.get<Asset>(`${this.baseUrl}/${id}`);
  }

  create(asset: Omit<Asset, 'id'>): Observable<string> {
    return this.api.post<string>(this.baseUrl, asset);
  }

  update(id: string, asset: Omit<Asset, 'id'>): Observable<void> {
    return this.api.put<void>(`assets/${id}`, asset);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}

