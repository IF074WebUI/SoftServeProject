import {Route} from '@angular/router';
import {AdminComponent} from './admin.component';
import {GroupComponent} from "./group/group.component";
import {StatisticsComponent} from './statistics/statistics.component';
export const adminRoutes: Route[] = [
  {
    path: '', component: AdminComponent,
    children: [
      /*тут, в дітях вписуємо свої роути*/
      {path: 'group', component: GroupComponent},
      {path: 'statistics', component: StatisticsComponent}
    ]
  }];
