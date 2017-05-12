import {Route} from "@angular/router";
import {AdminComponent} from "./admin.component";
export const adminRoutes: Route[] = [
  {path: '', component: AdminComponent, pathMatch: 'full'}
];
