import {Route} from '@angular/router';
import {AdminComponent} from './admin.component';
import {GroupComponent} from './group/group.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {FacultiesComponent} from './faculties/faculties.component';
import {TimetableComponent} from './timetable/timetable.component';
import {SpecialitiesComponent} from "./specialities/specialities.component";

export const adminRoutes: Route[] = [
  {
    path: '', component: AdminComponent,
    children: [
      {path: 'group', component: GroupComponent},
      {path: 'statistics', component: StatisticsComponent},
      {path: 'faculties', component: FacultiesComponent},
      {path: 'timetable', component: TimetableComponent},
      {path: 'specialities', component: SpecialitiesComponent}
    ]
  }];
