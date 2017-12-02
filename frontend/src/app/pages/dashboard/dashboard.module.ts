import { NgModule } from '@angular/core';
import { AngularEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';
import { SpiderChartDirective } from './directives/spider-chart.directive';
import { TeamAttributesComponent } from './components/team-attributes/team-attributes.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    DashboardComponent,
    BarGraphComponent,
    SpiderChartDirective,
    TeamAttributesComponent
  ],
  providers:[]
})
export class DashboardModule { }
