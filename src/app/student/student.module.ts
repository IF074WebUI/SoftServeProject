import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { studentRoutes } from './student.routes';
import { StudentComponent } from './student.component';
import { StudentsMainPageComponent } from './students-main-page/students-main-page.component';
@NgModule({
  declarations: [StudentComponent, StudentsMainPageComponent],
  imports: [RouterModule.forChild(studentRoutes)]
})
export class StudentModule {
}
