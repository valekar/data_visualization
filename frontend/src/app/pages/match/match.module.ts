import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchComponent } from './match.component';

import { ThemeModule } from '../../@theme/theme.module';
import { MapChartDirective } from './directives/map-chart.directive';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [MatchComponent, MapChartDirective]
})
export class MatchModule { }
