import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/explore" class="brand">Linky</a>

      <span class="spacer"></span>

      <a mat-button routerLink="/explore" routerLinkActive="active-link">Explorar</a>

      @if (auth.currentUser()) {
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/collections" routerLinkActive="active-link">Colecciones</a>

        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>

        <mat-menu #userMenu>
          <div class="menu-header">{{ auth.currentUser()?.displayName }}</div>
          <button mat-menu-item (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Cerrar sesión
          </button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/login">Iniciar sesión</a>
        <a mat-raised-button routerLink="/register">Registrarse</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .brand {
      font-size: 1.4rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .spacer { flex: 1; }
    .active-link { opacity: 0.7; }
    .menu-header {
      padding: 8px 16px;
      font-weight: 600;
      color: rgba(0,0,0,0.6);
      font-size: 0.85rem;
      border-bottom: 1px solid #eee;
    }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
}
