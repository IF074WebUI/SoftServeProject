import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { StudentGuard } from './guards/student.guard';
import { AccessDeniedComponent } from './error_pages/access-denied/access-denied.component';
import { LoginGuard } from './guards/login.guard';
import { BadRequestComponent } from './error_pages/bad-request/bad-request.component';
import { NotFoundComponent } from './error_pages/not-found/not-found.component';

export const routes: Route[] = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canLoad: [AdminGuard] },
  { path: 'student', loadChildren: './student/student.module#StudentModule', canLoad: [StudentGuard] },
  { path: 'denied', component: AccessDeniedComponent },
  { path: 'bad_request', component: BadRequestComponent },
  { path: '**', component: NotFoundComponent }
];

