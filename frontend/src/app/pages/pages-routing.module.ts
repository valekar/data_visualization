import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {TeamAttributesComponent} from './dashboard/components/team-attributes/team-attributes.component';
import {MatchComponent} from './match/match.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: '',
    component: DashboardComponent,

  },
  {
    path: 'dashboard/team/attributes/:id/:year',
    component:TeamAttributesComponent,
  },
  {
    path: 'matches',
    component:MatchComponent,
  },
  {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
