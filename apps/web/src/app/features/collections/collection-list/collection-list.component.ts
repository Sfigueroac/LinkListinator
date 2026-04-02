import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionsService } from '../../../core/services/collections.service';
import { Collection } from '../../../core/models/collection.model';
import { CollectionCardComponent } from '../../../shared/components/collection-card/collection-card.component';

@Component({
  selector: 'app-collection-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CollectionCardComponent,
  ],
  template: `
    <div class="page-container">
      <div class="header">
        <h1>Mis colecciones</h1>
        <a mat-raised-button color="primary" routerLink="/collections/new">
          <mat-icon>add</mat-icon> Nueva
        </a>
      </div>

      @if (loading()) {
        <div class="center"><mat-spinner /></div>
      } @else if (collections().length === 0) {
        <div class="empty">
          <mat-icon>collections_bookmark</mat-icon>
          <p>No tienes colecciones aún.</p>
          <a mat-raised-button color="primary" routerLink="/collections/new">Crear la primera</a>
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
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h1 { margin: 0; } }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .center { display: flex; justify-content: center; padding: 48px; }
    .empty { text-align: center; padding: 64px 24px; mat-icon { font-size: 64px; width: 64px; height: 64px; color: rgba(0,0,0,0.3); } p { color: rgba(0,0,0,0.5); margin: 16px 0; } }
  `],
})
export class CollectionListComponent implements OnInit {
  private service = inject(CollectionsService);
  private snackBar = inject(MatSnackBar);

  collections = signal<Collection[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.service.getMine().subscribe({
      next: (data) => { this.collections.set(data); this.loading.set(false); },
      error: () => { this.snackBar.open('Error al cargar colecciones', 'Cerrar', { duration: 3000 }); this.loading.set(false); },
    });
  }

}
