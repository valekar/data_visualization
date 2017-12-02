import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import {MatchModule} from './match/match.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import {CommonService} from './services/common.service';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MatchModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers:[CommonService]
})
export class PagesModule {
}
