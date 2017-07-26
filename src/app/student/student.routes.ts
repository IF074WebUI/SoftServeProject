import {Route} from '@angular/router';
import {StudentComponent} from './student.component';
import {TestPlayerComponent} from './test-player/test-player.component';
import {StudentsMainPageComponent} from './students-main-page/students-main-page.component';
import {StudentProfileComponent} from './student-profile/student-profile.component';
import {TestRezultsComponent} from './test-rezults/test-rezults.component';

export const studentRoutes: Route[] = [
  {
    path: '', component: StudentComponent,
    children: [
      {path: '', redirectTo: 'student-main', pathMatch: 'full'},
      {path: 'test-player', component: TestPlayerComponent},
      {path: 'studentProfile', component: StudentProfileComponent},
      {path: 'student-main', component: StudentsMainPageComponent},
      {path: 'test-rezults', component: TestRezultsComponent}
    ]},

];
