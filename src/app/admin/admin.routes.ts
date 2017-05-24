<<<<<<< HEAD
import {Route} from '@angular/router';
import {AdminComponent} from './admin.component';
import {GroupComponent} from './group/group.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {FacultiesComponent} from './faculties/faculties.component';
import { SubjectComponent } from './subject/subject.component';
=======
import { Route } from '@angular/router';
import { AdminComponent } from './admin.component';
import { GroupComponent } from './group/group.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SpecialitiesComponent } from "./specialities/specialities.component";
>>>>>>> 656a8f9c32079fc3ddf138c77a80b81e7a9e30e6

export const adminRoutes: Route[] = [
  {
    path: '', component: AdminComponent,
    children: [
      {path: 'group', component: GroupComponent},
      {path: 'statistics', component: StatisticsComponent},
      {path: 'faculties', component: FacultiesComponent},
<<<<<<< HEAD
      {path: 'subject', component: SubjectComponent}
=======
      {path: 'timetable', component: TimetableComponent},
      {path: 'specialities', component: SpecialitiesComponent}
>>>>>>> 656a8f9c32079fc3ddf138c77a80b81e7a9e30e6
    ]
  }];
