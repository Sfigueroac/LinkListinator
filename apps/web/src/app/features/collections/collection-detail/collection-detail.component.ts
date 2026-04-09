import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { CollectionsService } from '../../../core/services/collections.service';
import { LinksService } from '../../../core/services/links.service';
import { Collection } from '../../../core/models/collection.model';
import { Link } from '../../../core/models/link.model';
import { LinkCardComponent } from '../../../shared/components/link-card/link-card.component';
import { LinkFormComponent } from '../../links/link-form/link-form.component';

@Component({
  selector: 'app-collection-detail',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    LinkCardComponent,
  ],
  template: `
    <div class="page-container">
      @if (loading()) {
        <div class="center"><mat-spinner /></div>
      } @else if (collection()) {
        <div class="header">
          <div class="header-meta">
            <div class="header-title-row">
              <mat-icon class="header-icon" [class.public]="collection()!.isPublic">
                {{ collection()!.isPublic ? 'public' : 'lock' }}
              </mat-icon>
              <h1>{{ collection()!.name }}</h1>
            </div>
            @if (collection()!.description) {
              <p class="desc">{{ collection()!.description }}</p>
            }
            <span class="chip" [class.public]="collection()!.isPublic">
              {{ collection()!.isPublic ? 'Pública' : 'Privada' }}
            </span>
            @if (links().length > 0) {
              <span class="link-count-badge">{{ links().length }} link{{ links().length !== 1 ? 's' : '' }}</span>
            }
          </div>
          @if (isOwner()) {
            <div class="actions">
              <button mat-stroked-button [routerLink]="['/collections', collection()!.id, 'edit']">
                <mat-icon>edit</mat-icon> Editar
              </button>
              <button mat-raised-button color="primary" (click)="openAddLink()">
                <mat-icon>add</mat-icon> Añadir link
              </button>
            </div>
          }
        </div>

        @if (activeTag()) {
          <div class="filter-bar">
            <span>Filtrando por: <strong>{{ activeTag() }}</strong></span>
            <button mat-icon-button (click)="clearFilter()"><mat-icon>close</mat-icon></button>
          </div>
        }

        @if (filteredLinks().length === 0) {
          <div class="empty">
            <mat-icon>link_off</mat-icon>
            <p>{{ activeTag() ? 'No hay links con esa etiqueta.' : 'Esta colección está vacía.' }}</p>
            @if (isOwner() && !activeTag()) {
              <button mat-raised-button color="primary" (click)="openAddLink()">Añadir el primero</button>
            }
          </div>
        } @else {
          <div class="links">
            @for (link of filteredLinks(); track link.id) {
              <app-link-card
                [link]="link"
                [showDelete]="isOwner()"
                (tagClicked)="filterByTag($event)"
                (editClicked)="openEditLink($event)"
                (deleteClicked)="deleteLink($event)"
              />
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      padding: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      border-left: 4px solid #e0e0e0;
      &:has(.header-icon.public) { border-left-color: var(--brand-color); }
    }
    .header-meta { flex: 1; }
    .header-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
    }
    .header-icon {
      color: #9e9e9e;
      font-size: 22px;
      width: 22px;
      height: 22px;
      &.public { color: var(--brand-color); }
    }
    .header h1 { margin: 0; font-size: 1.6rem; font-weight: 700; }
    .desc { color: var(--text-secondary); margin: 0 0 10px; line-height: 1.4; }
    .chip {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 10px;
      font-size: 0.78rem;
      background: #eeeeee;
      color: #616161;
      &.public { background: #e8f5e9; color: #2e7d32; }
    }
    .link-count-badge {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 10px;
      border-radius: 10px;
      font-size: 0.78rem;
      background: #e3f2fd;
      color: var(--brand-color);
    }
    .actions { display: flex; gap: 8px; flex-shrink: 0; }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding: 10px 16px;
      background: #e3f2fd;
      border-radius: 8px;
      border-left: 3px solid var(--brand-color);
      font-size: 0.9rem;
    }
    .links { display: flex; flex-direction: column; gap: 6px; }
    .center { display: flex; justify-content: center; padding: 48px; }
    .empty {
      text-align: center;
      padding: 56px 24px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #bdbdbd; display: block; margin: 0 auto 12px; }
      p { color: var(--text-secondary); margin: 0 0 16px; }
    }
  `],
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private collectionsService = inject(CollectionsService);
  private linksService = inject(LinksService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  collection = signal<Collection | null>(null);
  links = signal<Link[]>([]);
  activeTag = signal<string | null>(null);
  loading = signal(true);

  isOwner = () =>
    !!this.auth.currentUser() &&
    this.collection()?.ownerId === this.auth.currentUser()?.id;

  filteredLinks = () => {
    const tag = this.activeTag();
    if (!tag) return this.links();
    return this.links().filter((l) => l.tags.some((t) => t.name === tag));
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.collectionsService.getOne(id).subscribe({
      next: (col) => {
        this.collection.set(col);
        this.links.set(col.links ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filterByTag(tag: string) {
    this.activeTag.set(tag);
  }

  clearFilter() {
    this.activeTag.set(null);
  }

  openAddLink() {
    const ref = this.dialog.open(LinkFormComponent, {
      data: { collectionId: this.collection()!.id },
      width: '500px',
    });
    ref.afterClosed().subscribe((link) => {
      if (link) this.links.update((ls) => [link, ...ls]);
    });
  }

  openEditLink(id: string) {
    const link = this.links().find((l) => l.id === id);
    if (!link) return;
    const ref = this.dialog.open(LinkFormComponent, {
      data: { collectionId: this.collection()!.id, link },
      width: '500px',
    });
    ref.afterClosed().subscribe((updated) => {
      if (updated) this.links.update((ls) => ls.map((l) => (l.id === updated.id ? updated : l)));
    });
  }

  deleteLink(id: string) {
    this.linksService.delete(id).subscribe({
      next: () => this.links.update((ls) => ls.filter((l) => l.id !== id)),
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 }),
    });
  }
}
