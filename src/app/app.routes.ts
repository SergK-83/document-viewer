import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'document',
    loadComponent: () =>
      import('./document-viewer/document-viewer.component').then(
        (c) => c.DocumentViewerComponent,
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
