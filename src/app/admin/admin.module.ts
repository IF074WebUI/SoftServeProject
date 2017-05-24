import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { MenuComponent } from './menu/menu.component';
import { GroupComponent } from './group/group.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticsService } from './statistics/statistics.service';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableService } from './timetable/timetable.service';
import { FacultiesComponent } from './faculties/faculties.component';
import { CommonModule } from '@angular/common';
import { GetRecordsByIdService } from './services/get-records-by-id.service';
import { SubjectComponent } from './subject/subject.component';
import { SubjectDetailComponent } from './subject/subject-detail/subject-detail.component';
import { SubjectSearchComponent } from './subject/subject-search/subject-search.component';
import { SubjectService } from './subject/subject.service';
import { SubjectUpdateComponent } from './subject/subject-update/subject-update.component';
import { GroupService } from './group/group.service';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { SpecialitiesService } from './services/specialities.service';
import { PaginationComponent } from './pagination/pagination.component';
import { CommonComponent } from './common/common.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { GetAllRecordsService } from './services/get-all-records.service';
import { DeleteRecordByIdService } from './services/delete-record-by-id.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdDialogModule, MdButtonModule } from '@angular/material';
import { StudentsComponent } from './students/students.component';
import { StudentsService } from './students/students.service';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { EditStudentComponent } from './students/edit-student/edit-student.component';
import { DeleteStudentComponent } from './students/delete-student/delete-student.component';


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    StatisticsComponent,
    GroupComponent,
    FacultiesComponent,
    SubjectComponent,
    SubjectDetailComponent,
    SubjectSearchComponent,
    SubjectUpdateComponent,
    TimetableComponent,
    SpecialitiesComponent,
    PaginationComponent,
    CommonComponent,
    SearchComponent,
    AddStudentComponent,
    EditStudentComponent,
    DeleteStudentComponent,
    StudentsComponent
    ],
  imports: [
    RouterModule.forChild(adminRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MdDialogModule,
    MdButtonModule
  ],
  providers: [
    StatisticsService,
    SpecialitiesService,
    TimetableService,
    GetRecordsByIdService,
    GroupService,
    GetAllRecordsService,
    DeleteRecordByIdService,
    SubjectService,
    StudentsService
  ],
  entryComponents: [
    AddStudentComponent,
    EditStudentComponent,
    DeleteStudentComponent]
})
export class AdminModule {}
