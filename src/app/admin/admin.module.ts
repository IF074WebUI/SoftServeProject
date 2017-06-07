import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import {GroupComponent} from './group/group.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {StatisticsService} from './statistics/statistics.service';
import {TimetableComponent} from './timetable/timetable.component';
import {TimetableService} from './timetable/timetable.service';
import {FacultiesComponent} from './faculties/faculties.component';
import {CommonModule} from '@angular/common';
import {GetRecordsByIdService} from './services/get-records-by-id.service';
import {SubjectComponent} from './subject/subject.component';
import {SubjectDetailComponent} from './subject/subject-detail/subject-detail.component';
import {SubjectService} from './subject/subject.service';
import {GroupService} from './group/group.service';
import {SpecialitiesComponent} from './specialities/specialities.component';
import {SpecialitiesService} from './services/specialities.service';
import {PaginationComponent} from './universal/pagination/pagination.component';
import {EntitiesTableComponent} from './universal/entities-table/entities-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchComponent} from './universal/search/search.component';
import {GetAllRecordsService} from './services/get-all-records.service';
import {DeleteRecordByIdService} from './services/delete-record-by-id.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MdDialogModule, MdButtonModule} from '@angular/material';
import {StudentsComponent} from './students/students.component';
import {StudentsService} from './students/students.service';
import {PopupComponent} from './popup/popup.component';
import { ItemsPerPageComponent } from './universal/items-per-page/items-per-page.component';
import { ResultsComponent } from './results/results.component';
import { ResultsService } from './services/results.service';
import { ExitAboutGuard } from '../guards/exit.about.guard';
import { GetRecordsRangeService } from './services/get-records-range.service';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { LinksPipe } from './pipes/links.pipe';
import { SpinnerComponent } from './universal/spinner/spinner.component';
import {TestsService} from './services/tests.service';
import { TestsComponent } from './tests/tests.component';
import { AddUpdateTestComponent } from './tests/add-update-test/add-update-test.component';
import { DeleteTestComponent } from './tests/delete-test/delete-test.component';
import { DeleteTimetableComponent } from './timetable/delete-timetable/delete-timetable.component';
import { AddUpdateTimetableComponent } from './timetable/add-update-timetable/add-update-timetable.component';
import { DetailedComponent } from './detailed/detailed.component';
import { SpinnerService } from './universal/spinner/spinner.service';
import { LoadingModule } from 'ngx-loading';
import {DynamicFormModule} from './universal/dynamic-form/dynamic-form.module';


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    StatisticsComponent,
    GroupComponent,
    FacultiesComponent,
    SubjectComponent,
    SubjectDetailComponent,
    TimetableComponent,
    SpecialitiesComponent,
    PaginationComponent,
    EntitiesTableComponent,
    SearchComponent,
    LinksPipe,
    StudentsComponent,
    PopupComponent,
    ItemsPerPageComponent,
    ResultsComponent,
    BreadcrumbsComponent,
    SpinnerComponent,
    TestsComponent,
    AddUpdateTestComponent,
    DeleteTestComponent,
    DeleteTimetableComponent,
    AddUpdateTimetableComponent,
    DetailedComponent
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
    MdButtonModule,
    LoadingModule
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
    SubjectService,
    StudentsService,
    ExitAboutGuard,
    GetRecordsRangeService,
    TestsService,
    SpinnerService
  ],
})
export class AdminModule {
}
