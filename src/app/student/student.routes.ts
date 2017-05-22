import {Route} from '@angular/router';
import {StudentComponent} from './student.component';
export const studentRoutes: Route[] = [
  {path: '', component: StudentComponent, pathMatch: 'full'}
];
