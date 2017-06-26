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
import { GroupService } from './group/group.service';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { SpecialitiesService } from './services/specialities.service';
import { PaginationComponent } from './universal/pagination/pagination.component';
import { EntitiesTableComponent } from './universal/entities-table/entities-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './universal/search/search.component';
import { GetAllRecordsService } from './services/get-all-records.service';
import { DeleteRecordByIdService } from './services/delete-record-by-id.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MdDialogModule, MdButtonModule } from '@angular/material';
import { StudentsComponent } from './students/students.component';
import { StudentsService } from './students/students.service';
import { ItemsPerPageComponent } from './universal/items-per-page/items-per-page.component';
import { ResultsComponent } from './results/results.component';
import { ResultsService } from './services/results.service';
import { ExitAboutGuard } from '../guards/exit.about.guard';
import { GetRecordsRangeService } from './services/get-records-range.service';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SpinnerComponent } from './universal/spinner/spinner.component';
import { TestsComponent } from './tests/tests.component';
import { AddUpdateTestComponent } from './tests/add-update-test/add-update-test.component';
import { DeleteTestComponent } from './tests/delete-test/delete-test.component';
import { DeleteTimetableComponent } from './timetable/delete-timetable/delete-timetable.component';
import { AddUpdateTimetableComponent } from './timetable/add-update-timetable/add-update-timetable.component';
import { TestsService } from './services/tests.service';
import { DetailedResultsComponent } from './detailed-results/detailed-results.component';
import { SpinnerService } from './universal/spinner/spinner.service';
import { LoadingModule } from 'ngx-loading';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { TestDetailComponent } from './test-detail/test-detail.component';
import { DynamicFormModule } from './universal/dynamic-form/dynamic-form.module';
import { QuestionsService } from './services/questions.service';
import { AnswersService } from './services/answers.service';
import { TestDetailService } from './test-detail/test-detail.service';
import { SubjectComponent } from './subject/subject.component';
import { GetRecordsBySearchService } from './services/get-records-by-search.service';
import { GetTestsBySubjectService } from './services/get-tests-by-subject.service';
import { ChartModule } from 'primeng/primeng';
import { SubjectService } from './subject/subject.service';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminUserService } from './admin-user/admin-user.service';
import { QuestionsComponent } from './questions/questions.component';
import { AnswersComponent } from './answers/answers.component';
import { ModalImgComponent } from './modal-img/modal-img.component';
import { FacultyService } from './services/faculty.service';
import { RadioButtonModule } from 'primeng/primeng';
import { ButtonsDirective } from './universal/directives/buttons.directive';


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    StatisticsComponent,
    GroupComponent,
    FacultiesComponent,
    TimetableComponent,
    SpecialitiesComponent,
    PaginationComponent,
    EntitiesTableComponent,
    SearchComponent,
    StudentsComponent,
    ItemsPerPageComponent,
    ResultsComponent,
    BreadcrumbsComponent,
    SpinnerComponent,
    TestsComponent,
    AddUpdateTestComponent,
    DeleteTestComponent,
    DeleteTimetableComponent,
    AddUpdateTimetableComponent,
    DetailedResultsComponent,
    TestDetailComponent,
    SubjectComponent,
    QuestionsComponent,
    AnswersComponent,
    ModalImgComponent,
    StudentProfileComponent,
    AdminUserComponent,
    SubjectComponent,
    ButtonsDirective,
  ],
  imports: [
    RouterModule.forChild(adminRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MdDialogModule,
    MdButtonModule,
    DynamicFormModule,
    LoadingModule,
    MdButtonModule,
    LoadingModule,
    ChartModule,
    RadioButtonModule
  ],
  providers: [
    StatisticsService,
    ResultsService,
    SpecialitiesService,
    BreadcrumbsService,
    TimetableService,
    GetRecordsByIdService,
    GroupService,
    GetAllRecordsService,
    DeleteRecordByIdService,
    StudentsService,
    ExitAboutGuard,
    GetRecordsRangeService,
    TestsService,
    SpinnerService,
    QuestionsService,
    AnswersService,
    TestDetailService,
    GetRecordsBySearchService,
    GetTestsBySubjectService,
    SubjectService,
    FacultyService,
    AdminUserService
  ],
})
export class AdminModule {
}
