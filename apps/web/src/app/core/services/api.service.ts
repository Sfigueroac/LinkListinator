import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/v1';

  get<T>(path: string) {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string) {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }
}
