import { Route } from '@angular/router';
import { StudentComponent } from './student.component';
import {StudentsMainPageComponent} from "./students-main-page/students-main-page.component";
export const studentRoutes: Route[] = [
  {path: '', redirectTo: 'studentMain', pathMatch: 'full'},
  { path: '', component: StudentComponent},
  { path:  'studentMain', component: StudentsMainPageComponent}
];
