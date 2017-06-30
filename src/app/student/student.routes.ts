import { Route } from '@angular/router';
import { StudentComponent } from './student.component';
export const studentRoutes: Route[] = [
  {path: '', redirectTo: 'student', pathMatch: 'full'},
  { path: 'student', component: StudentComponent},
  { path: '', component: StudentComponent, pathMatch: 'full' },
  { path: '/test-player', component: StudentComponent, pathMatch: 'full' }

];
