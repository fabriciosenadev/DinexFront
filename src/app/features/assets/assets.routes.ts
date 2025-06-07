import { Routes } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetFormComponent } from './asset-form/asset-form.component';

export const assetsRoutes: Routes = [
  {
    path: '',
    component: AssetListComponent,
  },
  {
    path: 'new',
    component: AssetFormComponent,
  },
  {
    path: ':id',
    component: AssetFormComponent,
  }
];
