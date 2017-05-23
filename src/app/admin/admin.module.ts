import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { GroupComponent } from './group/group.component';
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

})
export class AdminModule {}
