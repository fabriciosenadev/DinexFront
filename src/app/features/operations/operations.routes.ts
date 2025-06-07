import { Routes } from '@angular/router';
import { OperationListComponent } from './operation-list/operation-list.component';
import { OperationFormComponent } from './operation-form/operation-form.component';

export const operationsRoutes: Routes = [
  {
    path: '',
    component: OperationListComponent,
  },
  {
    path: 'new',
    component: OperationFormComponent,
  },
  {
    path: ':id',
    component: OperationFormComponent,
  }
];
