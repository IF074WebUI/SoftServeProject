import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {studentRoutes} from "./student.routes";
import {StudentComponent} from "./student.component";
@NgModule({
  declarations: [StudentComponent],
  imports: [RouterModule.forChild(studentRoutes)]
})
export class StudentModule {
}
