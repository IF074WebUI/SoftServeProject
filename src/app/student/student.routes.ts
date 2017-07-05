import {Route} from '@angular/router';
import {StudentComponent} from './student.component';
import {TestPlayerComponent} from './test-player/test-player.component';
import {StudentsMainPageComponent} from './students-main-page/students-main-page.component';

export const studentRoutes: Route[] = [
  {
    path: '', component: StudentComponent,
    children: [
      {path: '', redirectTo: 'student-main', pathMatch: 'full'},
      {path: 'test-player', component: TestPlayerComponent},
      {path: 'student-main', component: StudentsMainPageComponent}
    ]},

];
