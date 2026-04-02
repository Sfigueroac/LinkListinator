import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="auth-container">
      <div class="auth-brand">
        <mat-icon class="auth-brand-icon">bookmarks</mat-icon>
        <span class="auth-brand-name">Linky</span>
      </div>

      <mat-card class="auth-card">
        <mat-card-content>
          <h2 class="form-title">Crear cuenta</h2>
          <p class="form-subtitle">Empieza a guardar y compartir tus links</p>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Nombre para mostrar</mat-label>
              <mat-icon matPrefix>badge</mat-icon>
              <input matInput formControlName="displayName" />
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Nombre de usuario</mat-label>
              <mat-icon matPrefix>alternate_email</mat-icon>
              <input matInput formControlName="username" />
              <mat-hint>Sin espacios, mínimo 3 caracteres</mat-hint>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>mail</mat-icon>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Contraseña</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput [type]="showPass ? 'text' : 'password'" formControlName="password" />
              <button matSuffix mat-icon-button type="button" (click)="showPass = !showPass">
                <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint>Mínimo 6 caracteres</mat-hint>
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width submit-btn" type="submit"
              [disabled]="form.invalid || loading">
              {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 24px;
    }
    .auth-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .auth-brand-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--brand-color);
    }
    .auth-brand-name {
      font-size: 1.7rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--brand-color);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 8px 16px;
    }
    .form-title {
      margin: 8px 0 4px;
      font-size: 1.4rem;
      font-weight: 600;
    }
    .form-subtitle {
      margin: 0 0 20px;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    mat-form-field { margin-bottom: 8px; }
    .submit-btn { margin-top: 8px; font-size: 1rem; height: 48px; }
    mat-card-actions {
      padding: 12px 16px 16px;
      text-align: center;
      p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; }
      a { font-weight: 600; }
    }
  `],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  showPass = false;

  form = this.fb.group({
    displayName: [''],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, username, password, displayName } = this.form.value;

    this.auth.register(email!, username!, password!, displayName || undefined).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Error al registrarse', 'Cerrar', { duration: 3000 });
        this.loading = false;
      },
    });
  }
}
