import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Collection } from '../../../core/models/collection.model';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <mat-card class="collection-card" [routerLink]="['/collections', collection.id]">
      <div class="card-accent" [class.public]="collection.isPublic"></div>
      <mat-card-header>
        <div mat-card-avatar class="avatar" [class.public]="collection.isPublic">
          <mat-icon>{{ collection.isPublic ? 'public' : 'lock' }}</mat-icon>
        </div>
        <mat-card-title>{{ collection.name }}</mat-card-title>
        <mat-card-subtitle>
          @if (collection.owner) {
            por {{ collection.owner.displayName || collection.owner.username }}
          }
        </mat-card-subtitle>
      </mat-card-header>
      @if (collection.description) {
        <mat-card-content>
          <p class="description">{{ collection.description }}</p>
        </mat-card-content>
      }
      <mat-card-footer class="card-footer">
        <span class="visibility-badge" [class.public]="collection.isPublic">
          {{ collection.isPublic ? 'Pública' : 'Privada' }}
        </span>
        @if (collection.links !== undefined) {
          <span class="link-count">
            <mat-icon>link</mat-icon> {{ collection.links.length }}
          </span>
        }
        <mat-icon class="arrow">chevron_right</mat-icon>
      </mat-card-footer>
    </mat-card>
  `,
  styles: [`
    .collection-card {
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.15s;
      overflow: hidden;
      position: relative;
      &:hover {
        box-shadow: var(--shadow-card-hover) !important;
        transform: translateY(-2px);
      }
    }
    .card-accent {
      height: 4px;
      background: #e0e0e0;
      &.public { background: linear-gradient(90deg, #1565c0, #42a5f5); }
    }
    mat-card-header { padding-top: 12px; }
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px !important;
      background: #e0e0e0;
      mat-icon { font-size: 20px; width: 20px; height: 20px; color: #757575; }
      &.public { background: #e3f2fd; mat-icon { color: var(--brand-color); } }
    }
    .description { color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.4; }
    .card-footer {
      display: flex;
      align-items: center;
      padding: 8px 16px 12px;
      gap: 8px;
      min-height: unset !important;
    }
    .visibility-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 10px;
      background: #eeeeee;
      color: #616161;
      &.public { background: #e8f5e9; color: #2e7d32; }
    }
    .link-count {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .arrow {
      color: #bdbdbd;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `],
})
export class CollectionCardComponent {
  @Input({ required: true }) collection!: Collection;
}
