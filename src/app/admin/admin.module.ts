import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {StatisticsService} from './statistics/statistics.service';
@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent],
  imports: [RouterModule.forChild(adminRoutes)],
  providers: [StatisticsService]
})
export class AdminModule {

}
