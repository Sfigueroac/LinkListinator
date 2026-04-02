import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollectionsService } from '../../../core/services/collections.service';

@Component({
  selector: 'app-collection-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="page-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEdit() ? 'Editar' : 'Nueva' }} colección</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Descripción (opcional)</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-checkbox formControlName="isPublic">
              Colección pública (visible para todos)
            </mat-checkbox>

            <div class="actions">
              <button mat-button type="button" (click)="cancel()">Cancelar</button>
              @if (isEdit()) {
                <button mat-stroked-button color="warn" type="button"
                  [disabled]="loading()" (click)="delete()">
                  <mat-icon>delete</mat-icon> Eliminar
                </button>
              }
              <button mat-raised-button color="primary" type="submit"
                [disabled]="form.invalid || loading()">
                {{ loading() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-card { max-width: 600px; margin: 0 auto; padding: 16px; }
    mat-form-field { margin-bottom: 16px; }
    mat-checkbox { margin-bottom: 24px; display: block; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
  `],
})
export class CollectionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CollectionsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  isEdit = signal(false);
  collectionId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    isPublic: [false],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.collectionId.set(id);
      this.service.getOne(id).subscribe({
        next: (col) => this.form.patchValue(col),
        error: () => this.router.navigate(['/collections']),
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const data = this.form.value as { name: string; description?: string; isPublic: boolean };

    const op = this.isEdit()
      ? this.service.update(this.collectionId()!, data)
      : this.service.create(data);

    op.subscribe({
      next: (col) => this.router.navigate(['/collections', col.id]),
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Error al guardar', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  delete() {
    this.loading.set(true);
    this.service.delete(this.collectionId()!).subscribe({
      next: () => this.router.navigate(['/collections']),
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Error al eliminar', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate([this.isEdit() ? `/collections/${this.collectionId()}` : '/collections']);
  }
}
