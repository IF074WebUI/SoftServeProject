import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { GroupComponent } from './group/group.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {StatisticsService} from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableService } from './timetable/timetable.service';
import {CommonModule} from '@angular/common';
import {GetRecordsByIdService} from './services/get-records-by-id.service';



@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent, GroupComponent, FacultiesComponent, TimetableComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule],
  providers: [StatisticsService, TimetableService, GetRecordsByIdService]

})
export class AdminModule {}
