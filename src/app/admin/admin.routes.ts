import {Route} from '@angular/router';
import {AdminComponent} from './admin.component';
import {GroupComponent} from './group/group.component';
export const adminRoutes: Route[] = [
  {path: '', component: AdminComponent, pathMatch: 'full'},
  {path: 'group', component: GroupComponent}
];
