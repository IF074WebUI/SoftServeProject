import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { GroupComponent } from './group/group.component';
import {StatisticsComponent} from "./statistics/statistics.component";
import {StatisticsService} from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import {GroupService} from "./group/group.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { StudentsComponent } from './students/students.component';
import {StudentsService} from "./students/students.service";


@NgModule({
  declarations: [AdminComponent, MenuComponent, StatisticsComponent, GroupComponent, FacultiesComponent, StudentsComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule, FormsModule],
  providers: [StatisticsService, GroupService, StudentsService]

})
export class AdminModule {}
