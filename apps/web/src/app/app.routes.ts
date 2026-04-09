import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/explore', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'collections',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/collections/collection-list/collection-list.component').then(
        (m) => m.CollectionListComponent,
      ),
  },
  {
    path: 'collections/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/collections/collection-form/collection-form.component').then(
        (m) => m.CollectionFormComponent,
      ),
  },
  {
    path: 'collections/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/collections/collection-form/collection-form.component').then(
        (m) => m.CollectionFormComponent,
      ),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('./features/collections/collection-detail/collection-detail.component').then(
        (m) => m.CollectionDetailComponent,
      ),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./features/explore/explore.component').then((m) => m.ExploreComponent),
  },
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  { path: '**', redirectTo: '/explore' },
];
