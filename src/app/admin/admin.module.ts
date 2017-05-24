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
    SearchComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule, FormsModule, ReactiveFormsModule],
  providers: [StatisticsService, SubjectService, SpecialitiesService, TimetableService, GetRecordsByIdService, GroupService ]
})
export class AdminModule {}
