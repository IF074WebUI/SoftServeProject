import {Route} from '@angular/router';
import {AdminComponent} from './admin.component';
import {StatisticsComponent} from "./statistics/statistics.component";
export const adminRoutes: Route[] = [
  {path: '', component: AdminComponent, children: [
    /*тут, в дітях вписуємо свої роути*/
    {path: 'statistics', component: StatisticsComponent}
  ]},

];
