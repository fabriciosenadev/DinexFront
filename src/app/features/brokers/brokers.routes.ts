import { Routes } from '@angular/router';
import { BrokerListComponent } from './broker-list/broker-list.component';
import { BrokerFormComponent } from './broker-form/broker-form.component';

export const brokersRoutes: Routes = [
  {
    path: '',
    component: BrokerListComponent,
  },
  {
    path: 'new',
    component: BrokerFormComponent,
  },
  {
    path: ':id',
    component: BrokerFormComponent,
  }
];
