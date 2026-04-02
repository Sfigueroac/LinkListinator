import { Component, OnInit, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CollectionsService } from '../../core/services/collections.service';
import { TagsService } from '../../core/services/tags.service';
import { Collection } from '../../core/models/collection.model';
import { Tag } from '../../core/models/tag.model';
import { CollectionCardComponent } from '../../shared/components/collection-card/collection-card.component';

@Component({
  selector: 'app-explore',
  imports: [
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    CollectionCardComponent,
  ],
  template: `
    <div class="page-container">
      <div class="hero">
        <mat-icon class="hero-icon">travel_explore</mat-icon>
        <h1>Descubre lo que otros guardan</h1>
        <p>Colecciones públicas de links compartidas por la comunidad</p>
      </div>

      @if (popularTags().length > 0) {
        <div class="tags-section">
          <div class="tags-header">
            @if (activeTag()) {
              <span class="tags-label">Filtrando por:</span>
              <button mat-button color="primary" (click)="filterByTag(activeTag()!)">
                <mat-icon>close</mat-icon> Limpiar filtro
              </button>
            } @else {
              <span class="tags-label">Temas populares</span>
            }
          </div>
          <mat-chip-set>
            @for (tag of popularTags(); track tag.id) {
              <mat-chip (click)="filterByTag(tag.name)" [highlighted]="activeTag() === tag.name">
                # {{ tag.name }}
              </mat-chip>
            }
          </mat-chip-set>
        </div>
      }

      @if (loading()) {
        <div class="center"><mat-spinner /></div>
      } @else if (collections().length === 0) {
        <div class="empty">
          <mat-icon>folder_off</mat-icon>
          <p>No hay colecciones públicas aún.</p>
        </div>
      } @else {
        <div class="grid">
          @for (col of collections(); track col.id) {
            <app-collection-card [collection]="col" />
          }
        </div>

        <mat-paginator
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageSizeOptions]="[12, 24, 48]"
          (page)="onPage($event)"
        />
      }
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 48px 24px 40px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 16px;
      margin-bottom: 32px;
    }
    .hero-icon {
      font-size: 52px;
      width: 52px;
      height: 52px;
      color: var(--brand-color);
      margin-bottom: 12px;
      display: block;
      margin-inline: auto;
    }
    .hero h1 {
      margin: 0 0 10px;
      font-size: 1.9rem;
      font-weight: 700;
      color: #0d2d5e;
    }
    .hero p {
      margin: 0;
      color: rgba(0,0,0,0.6);
      font-size: 1.05rem;
    }
    .tags-section { margin-bottom: 28px; }
    .tags-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .tags-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .center { display: flex; justify-content: center; padding: 48px; }
    .empty {
      text-align: center;
      padding: 48px;
      color: var(--text-secondary);
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 16px; opacity: 0.4; }
    }
  `],
})
export class ExploreComponent implements OnInit {
  private collectionsService = inject(CollectionsService);
  private tagsService = inject(TagsService);

  collections = signal<Collection[]>([]);
  popularTags = signal<Tag[]>([]);
  activeTag = signal<string | null>(null);
  loading = signal(true);
  totalItems = 0;
  pageSize = 12;
  currentPage = 1;

  ngOnInit() {
    this.load();
    this.tagsService.getPopular().subscribe((tags) => this.popularTags.set(tags));
  }

  load(page = 1) {
    this.loading.set(true);
    this.currentPage = page;
    this.collectionsService.getPublic(page, this.pageSize).subscribe({
      next: (data) => {
        this.collections.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filterByTag(tag: string) {
    this.activeTag.update((current) => (current === tag ? null : tag));
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.load(event.pageIndex + 1);
  }
}
