import {Route} from '@angular/router';
import {StudentComponent} from './student.component';
import {TestPlayerComponent} from './test-player/test-player.component';

export const studentRoutes: Route[] = [
  {
    path: '', component: StudentComponent,
    children: [
      {path: 'student', component: StudentComponent},

      {path: '', redirectTo: 'student', pathMatch: 'full'},
    ]},
  {path: 'test-player', component: TestPlayerComponent},

];
