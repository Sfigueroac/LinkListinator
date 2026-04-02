import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private api = inject(ApiService);

  getAll() {
    return this.api.get<Tag[]>('/tags').pipe(map((r) => r.data));
  }

  getPopular() {
    return this.api.get<Tag[]>('/tags/popular').pipe(map((r) => r.data));
  }
}
