import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Link } from '../models/link.model';

@Injectable({ providedIn: 'root' })
export class LinksService {
  private api = inject(ApiService);

  getMine(filters: { collectionId?: string; tag?: string; page?: number; limit?: number } = {}) {
    const params = new URLSearchParams();
    if (filters.collectionId) params.set('collectionId', filters.collectionId);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    return this.api.get<Link[]>(`/links${query ? '?' + query : ''}`).pipe(map((r) => r.data));
  }

  search(tag: string) {
    return this.api.get<Link[]>(`/links/search?tag=${tag}`).pipe(map((r) => r.data));
  }

  searchMine(q: string) {
    return this.api
      .get<Link[]>(`/links/search-mine?q=${encodeURIComponent(q)}`)
      .pipe(map((r) => r.data));
  }

  fetchMeta(url: string) {
    return this.api
      .get<{ title: string; description: string }>(`/links/meta?url=${encodeURIComponent(url)}`)
      .pipe(map((r) => r.data));
  }

  create(data: { url: string; title: string; description?: string; collectionId: string; tags?: string[] }) {
    return this.api.post<Link>('/links', data).pipe(map((r) => r.data));
  }

  update(id: string, data: Partial<{ url: string; title: string; description: string; collectionId: string; tags: string[] }>) {
    return this.api.patch<Link>(`/links/${id}`, data).pipe(map((r) => r.data));
  }

  delete(id: string) {
    return this.api.delete(`/links/${id}`);
  }
}
