import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { GroupComponent } from './group/group.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {StatisticsService} from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import {GroupService} from './group/group.service';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MdDialogModule, MdButtonModule} from '@angular/material';
import { StudentsComponent } from './students/students.component';
import {StudentsService} from './students/students.service';
import { PaginationComponent } from './pagination/pagination.component';

import {AddStudentComponent} from './students/add-student/add-student.component';
import {EditStudentComponent} from './students/edit-student/edit-student.component';
import {DeleteStudentComponent} from './students/delete-student/delete-student.component';

@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent, GroupComponent, FacultiesComponent, AddStudentComponent, EditStudentComponent, DeleteStudentComponent, PaginationComponent, StudentsComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule, FormsModule, MdDialogModule, MdButtonModule, ReactiveFormsModule],
  providers: [StatisticsService, GroupService, StudentsService],
  entryComponents: [AddStudentComponent, EditStudentComponent, DeleteStudentComponent]
})
export class AdminModule {}
