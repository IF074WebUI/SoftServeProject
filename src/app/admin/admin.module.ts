import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {adminRoutes} from './admin.routes';
import {AdminComponent} from './admin.component';
import {MenuComponent} from './menu/menu.component';
import { GroupComponent } from './group/group.component';
import {StatisticsComponent} from "./statistics/statistics.component";
import {StatisticsService} from './statistics/statistics.service';
import { FacultiesComponent } from './faculties/faculties.component';
import { SpecialitiesComponent } from './specialities/specialities.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CommonComponent } from './common/common.component';
import {SpecialitiesService} from "./services/specialities.service";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    AdminComponent,
    MenuComponent,
    StatisticsComponent,
    GroupComponent,
    FacultiesComponent,
    SpecialitiesComponent,
    PaginationComponent,
    CommonComponent],
  imports: [RouterModule.forChild(adminRoutes), CommonModule],
  providers: [StatisticsService, SpecialitiesService]

})
export class AdminModule {}
