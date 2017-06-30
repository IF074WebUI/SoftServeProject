import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {studentRoutes} from './student.routes';
import {StudentComponent} from './student.component';
// import {BrowserModule} from "@angular/platform-browser";
// import {FormsModule} from "@angular/forms";
// import {HttpModule} from "@angular/http";
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TestPlayerComponent} from './test-player/test-player.component';
import {TestPlayerService} from './test-player/test-player.service';

import {StudentsMainPageComponent} from './students-main-page/students-main-page.component';
import {LoginService} from '../login/login.service';
import {GetTestsBySubjectService} from '../admin/services/get-tests-by-subject.service';
import {CommonModule} from '@angular/common';
@NgModule({

  declarations: [StudentComponent, TestPlayerComponent, StudentsMainPageComponent],
  imports: [RouterModule.forChild(studentRoutes),
    CommonModule],
  providers: [TestPlayerService, LoginService, GetTestsBySubjectService],
})

  export class StudentModule {
  }


