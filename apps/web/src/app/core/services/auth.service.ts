import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { AuthResponse, User } from '../models/user.model';

const TOKEN_KEY = 'linky_token';
const USER_KEY = 'linky_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private storage = inject(StorageService);
  private router = inject(Router);

  currentUser = signal<User | null>(this.loadUser());

  private loadUser(): User | null {
    const raw = this.storage.get(USER_KEY);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return this.storage.get(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  register(email: string, username: string, password: string, displayName?: string) {
    return this.api
      .post<AuthResponse>('/auth/register', { email, username, password, displayName })
      .pipe(
        map((res) => res.data),
        tap((data) => this.persist(data)),
      );
  }

  login(email: string, password: string) {
    return this.api
      .post<AuthResponse>('/auth/login', { email, password })
      .pipe(
        map((res) => res.data),
        tap((data) => this.persist(data)),
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private persist(data: AuthResponse) {
    this.storage.set(TOKEN_KEY, data.accessToken);
    this.storage.set(USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }
}
