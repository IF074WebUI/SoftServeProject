import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {adminRoutes} from "./admin.routes";
import {AdminComponent} from "./admin.component";
import {MenuComponent} from "./menu/menu.component";
@NgModule({
  declarations: [AdminComponent, MenuComponent],
  imports: [RouterModule.forChild(adminRoutes)]
})
export class AdminModule {

}
