import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin.routes';
import { AdminComponent } from './admin.component';
import { MenuComponent } from './menu/menu.component';
import { GroupComponent } from './group/group.component';
<<<<<<< HEAD
import {StatisticsComponent} from './statistics/statistics.component';
import {StatisticsService} from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import { SubjectComponent } from './subject/subject.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubjectDetailComponent } from './subject/subject-detail/subject-detail.component';
import { SubjectSearchComponent } from './subject/subject-search/subject-search.component';
import {SubjectService} from './subject/subject.service';
import { SubjectUpdateComponent } from './subject/subject-update/subject-update.component';



@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent, GroupComponent, FacultiesComponent,
    SubjectComponent, SubjectDetailComponent, SubjectSearchComponent, SubjectUpdateComponent],
  imports: [RouterModule.forChild(adminRoutes), FormsModule, CommonModule],
  providers: [StatisticsService, SubjectService]

=======
import { StatisticsComponent } from './statistics/statistics.component';
import { StatisticsService } from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableService } from './timetable/timetable.service';
import { CommonModule } from '@angular/common';
import { GetRecordsByIdService } from './services/get-records-by-id.service';
import { GroupService } from './group/group.service';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CommonComponent } from './common/common.component';
import { SpecialitiesService } from "./services/specialities.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchComponent } from './search/search.component';

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
    CommonComponent,
    SearchComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule, FormsModule, ReactiveFormsModule],
  providers: [StatisticsService, SpecialitiesService, TimetableService, GetRecordsByIdService, GroupService ]
>>>>>>> 656a8f9c32079fc3ddf138c77a80b81e7a9e30e6
})
export class AdminModule {}
