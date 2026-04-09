import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { LinksService } from '../../core/services/links.service';
import { Link } from '../../core/models/link.model';
import { LinkCardComponent } from '../../shared/components/link-card/link-card.component';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    LinkCardComponent,
  ],
  template: `
    <div class="page-container">
      <mat-form-field class="search-field" appearance="outline">
        <mat-label>Buscar en tus links</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input matInput [formControl]="query" placeholder="Título, URL o etiqueta..." />
        @if (loading()) {
          <mat-spinner matSuffix diameter="20" />
        }
      </mat-form-field>

      @if (query.value && !loading()) {
        <p class="results-count">
          {{ results().length }} resultado{{ results().length !== 1 ? 's' : '' }}
          para <strong>{{ query.value }}</strong>
        </p>
      }

      @if (results().length > 0) {
        <div class="results">
          @for (link of results(); track link.id) {
            <div class="result-item">
              @if (link.collection) {
                <a class="collection-label" [routerLink]="['/collections', link.collection.id]">
                  <mat-icon>folder</mat-icon> {{ link.collection.name }}
                </a>
              }
              <app-link-card [link]="link" />
            </div>
          }
        </div>
      } @else if (query.value && !loading()) {
        <div class="empty">
          <mat-icon>search_off</mat-icon>
          <p>No hay resultados para "{{ query.value }}"</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .search-field { width: 100%; margin-bottom: 8px; }
    .results-count { color: var(--text-secondary); font-size: 0.9rem; margin: 0 0 16px; }
    .results { display: flex; flex-direction: column; gap: 4px; }
    .result-item { display: flex; flex-direction: column; gap: 2px; }
    .collection-label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.78rem;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0 4px;
      &:hover { color: var(--brand-color); }
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .empty {
      text-align: center;
      padding: 56px 24px;
      color: var(--text-secondary);
      mat-icon { font-size: 48px; width: 48px; height: 48px; display: block; margin: 0 auto 12px; opacity: 0.4; }
    }
  `],
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private linksService = inject(LinksService);

  query = new FormControl('');
  results = signal<Link[]>([]);
  loading = signal(false);

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.query.setValue(q);

    this.query.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => {
        if (!q || q.trim().length < 2) { this.results.set([]); return of([]); }
        this.loading.set(true);
        return this.linksService.searchMine(q.trim());
      }),
    ).subscribe({
      next: (res) => { this.results.set(res); this.loading.set(false); },
      error: () => this.loading.set(false),
    });

    if (q.trim().length >= 2) {
      this.loading.set(true);
      this.linksService.searchMine(q.trim()).subscribe({
        next: (res) => { this.results.set(res); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }
}
