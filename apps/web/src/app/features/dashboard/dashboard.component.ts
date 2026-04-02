import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { CollectionsService } from '../../core/services/collections.service';
import { Collection } from '../../core/models/collection.model';
import { CollectionCardComponent } from '../../shared/components/collection-card/collection-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CollectionCardComponent,
  ],
  template: `
    <div class="page-container">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>Hola, {{ auth.currentUser()?.displayName }}</h1>
          <p>{{ collections().length > 0 ? (collections().length + ' colección' + (collections().length !== 1 ? 'es' : '')) : 'Tu biblioteca de links' }}</p>
        </div>
        <a mat-raised-button color="primary" routerLink="/collections/new">
          <mat-icon>add</mat-icon> Nueva colección
        </a>
      </div>

      @if (loading()) {
        <div class="center">
          <mat-spinner />
        </div>
      } @else if (collections().length === 0) {
        <div class="empty">
          <mat-icon>bookmarks</mat-icon>
          <h3>Tu biblioteca está vacía</h3>
          <p>Crea tu primera colección y empieza a guardar links</p>
          <a mat-raised-button color="primary" routerLink="/collections/new">
            <mat-icon>add</mat-icon> Crear colección
          </a>
        </div>
      } @else {
        <div class="grid">
          @for (col of collections(); track col.id) {
            <app-collection-card [collection]="col" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding: 24px 28px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      border-left: 4px solid var(--brand-color);
    }
    .welcome-text {
      h1 { margin: 0; font-size: 1.5rem; font-weight: 700; }
      p { margin: 4px 0 0; color: var(--text-secondary); }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .center { display: flex; justify-content: center; padding: 48px; }
    .empty {
      text-align: center;
      padding: 72px 24px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      mat-icon { font-size: 64px; width: 64px; height: 64px; color: #bdbdbd; display: block; margin: 0 auto 16px; }
      h3 { margin: 0 0 8px; font-size: 1.2rem; }
      p { color: var(--text-secondary); margin: 0 0 24px; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private collectionsService = inject(CollectionsService);
  private snackBar = inject(MatSnackBar);

  collections = signal<Collection[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.collectionsService.getMine().subscribe({
      next: (data) => { this.collections.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

}
