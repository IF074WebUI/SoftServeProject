import { Route} from '@angular/router';
import { AdminComponent } from './admin.component';
import { GroupComponent } from './group/group.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { FacultiesComponent } from './faculties/faculties.component';
import { SubjectComponent } from './subject/subject.component';
import { TimetableComponent } from './timetable/timetable.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { StudentsComponent } from './students/students.component';
import { ResultsComponent } from './results/results.component';
import {AddeditComponent} from './addedit/addedit.component';
import {ExitAboutGuard} from '../guards/exit.about.guard';

export const adminRoutes: Route[] = [
  {
    path: '', component: AdminComponent,
    children: [
      {path: 'group', component: GroupComponent},
      {path: 'statistics', component: StatisticsComponent},
      {path: 'faculties', component: FacultiesComponent},
      {path: 'subject', component: SubjectComponent},
      {path: 'timetable', component: TimetableComponent},
      {path: 'specialities', component: SpecialitiesComponent},
      {path: 'students', component: StudentsComponent},
      {path: 'results', component: ResultsComponent},
      {path: 'addedit', component: AddeditComponent, canDeactivate: [ExitAboutGuard]},

    ]
  }];
