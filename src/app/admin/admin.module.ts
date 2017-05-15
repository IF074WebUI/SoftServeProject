import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { StatisticsComponent } from './statistics/statistics.component';
@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent],
  imports: [RouterModule.forChild(adminRoutes)]
})
export class AdminModule {

}
