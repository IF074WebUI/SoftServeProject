import { Route } from '@angular/router';
import { StudentComponent } from './student.component';
import {TestPlayerComponent} from "./test-player/test-player.component";
export const studentRoutes: Route[] = [
  {path: '', redirectTo: 'student', pathMatch: 'full'},
  { path: 'student', component: StudentComponent},
  // { path: '', component: StudentComponent, pathMatch: 'full' },
  { path: 'test-player', component: TestPlayerComponent, pathMatch: 'full' }

];
