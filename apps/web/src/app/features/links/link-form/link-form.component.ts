import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LinksService } from '../../../core/services/links.service';

export interface LinkFormData {
  collectionId: string;
}

@Component({
  selector: 'app-link-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Añadir link</h2>

    <mat-dialog-content>
      <form [formGroup]="form" id="linkForm">
        <mat-form-field class="full-width">
          <mat-label>URL</mat-label>
          <input matInput formControlName="url" placeholder="https://..." />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Etiquetas</mat-label>
          <mat-chip-grid #chipGrid>
            @for (tag of tags(); track tag) {
              <mat-chip-row (removed)="removeTag(tag)">
                {{ tag }}
                <button matChipRemove><mat-icon>cancel</mat-icon></button>
              </mat-chip-row>
            }
          </mat-chip-grid>
          <input
            placeholder="Añadir etiqueta..."
            [matChipInputFor]="chipGrid"
            [matChipInputSeparatorKeyCodes]="separatorKeys"
            (matChipInputTokenEnd)="addTag($event)"
          />
          <mat-hint>Presiona Enter o coma para añadir</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary"
        form="linkForm" (click)="submit()"
        [disabled]="form.invalid || loading()">
        {{ loading() ? 'Guardando...' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { display: flex; flex-direction: column; min-width: 400px; }
    mat-form-field { margin-bottom: 12px; }
  `],
})
export class LinkFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private linksService = inject(LinksService);
  dialogRef = inject(MatDialogRef<LinkFormComponent>);

  separatorKeys = [ENTER, COMMA];
  tags = signal<string[]>([]);
  loading = signal(false);

  form = this.fb.group({
    url: ['', [Validators.required]],
    title: ['', Validators.required],
    description: [''],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: LinkFormData) {}

  ngOnInit() {}

  addTag(event: MatChipInputEvent) {
    const value = (event.value || '').trim().toLowerCase();
    if (value && !this.tags().includes(value)) {
      this.tags.update((t) => [...t, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string) {
    this.tags.update((t) => t.filter((x) => x !== tag));
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { url, title, description } = this.form.value;

    this.linksService
      .create({
        url: url!,
        title: title!,
        description: description || undefined,
        collectionId: this.data.collectionId,
        tags: this.tags(),
      })
      .subscribe({
        next: (link) => this.dialogRef.close(link),
        error: () => this.loading.set(false),
      });
  }
}
