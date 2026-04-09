import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Link } from '../../../core/models/link.model';

@Component({
  selector: 'app-link-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <mat-card class="link-card">
      <mat-card-header>
        <img mat-card-avatar [src]="faviconUrl(link.url)" [alt]="link.title" class="favicon"
          (error)="onFaviconError($event)" />
        <mat-card-title>
          <a [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.title }}</a>
        </mat-card-title>
        <mat-card-subtitle class="domain-row">
          <mat-icon class="domain-icon">language</mat-icon>
          {{ domain(link.url) }}
        </mat-card-subtitle>
      </mat-card-header>

      @if (link.description) {
        <mat-card-content>
          <p class="description">{{ link.description }}</p>
        </mat-card-content>
      }

      <mat-card-actions>
        @if (link.tags.length > 0) {
          <mat-chip-set>
            @for (tag of link.tags; track tag.id) {
              <mat-chip class="tag-chip" (click)="tagClicked.emit(tag.name)">
                # {{ tag.name }}
              </mat-chip>
            }
          </mat-chip-set>
        }
        <span class="spacer"></span>
        <a mat-icon-button [href]="link.url" target="_blank" rel="noopener noreferrer"
          matTooltip="Abrir link">
          <mat-icon>open_in_new</mat-icon>
        </a>
        @if (showDelete) {
          <button mat-icon-button (click)="editClicked.emit(link.id)"
            matTooltip="Editar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteClicked.emit(link.id)"
            matTooltip="Eliminar">
            <mat-icon>delete_outline</mat-icon>
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .link-card {
      margin-bottom: 8px;
      transition: box-shadow 0.2s;
      &:hover { box-shadow: var(--shadow-card-hover) !important; }
    }
    .favicon {
      object-fit: contain;
      border-radius: 6px !important;
      background: #f5f5f5;
      border: 1px solid #eeeeee;
    }
    .description { color: var(--text-secondary); font-size: 0.9rem; margin: 0; line-height: 1.5; }
    a {
      color: inherit;
      text-decoration: none;
      font-weight: 500;
      &:hover { color: var(--brand-color); text-decoration: underline; }
    }
    .domain-row {
      display: flex !important;
      align-items: center;
      gap: 3px;
    }
    .domain-icon { font-size: 13px; width: 13px; height: 13px; opacity: 0.5; }
    mat-card-actions {
      display: flex;
      align-items: center;
      padding: 4px 8px 8px;
      flex-wrap: wrap;
      gap: 4px;
    }
    .tag-chip { cursor: pointer; font-size: 0.78rem; }
    .spacer { flex: 1; }
  `],
})
export class LinkCardComponent {
  @Input({ required: true }) link!: Link;
  @Input() showDelete = false;

  @Output() tagClicked = new EventEmitter<string>();
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  domain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  faviconUrl(url: string): string {
    const d = this.domain(url);
    return `https://www.google.com/s2/favicons?domain=${d}&sz=32`;
  }

  onFaviconError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
