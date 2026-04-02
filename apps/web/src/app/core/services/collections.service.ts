import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Collection } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionsService {
  private api = inject(ApiService);

  getMine() {
    return this.api.get<Collection[]>('/collections').pipe(map((r) => r.data));
  }

  getPublic(page = 1, limit = 20) {
    return this.api
      .get<Collection[]>(`/collections/public?page=${page}&limit=${limit}`)
      .pipe(map((r) => r.data));
  }

  getOne(id: string) {
    return this.api.get<Collection>(`/collections/${id}`).pipe(map((r) => r.data));
  }

  create(data: { name: string; description?: string; isPublic: boolean }) {
    return this.api.post<Collection>('/collections', data).pipe(map((r) => r.data));
  }

  update(id: string, data: Partial<{ name: string; description: string; isPublic: boolean }>) {
    return this.api.patch<Collection>(`/collections/${id}`, data).pipe(map((r) => r.data));
  }

  delete(id: string) {
    return this.api.delete(`/collections/${id}`);
  }
}
