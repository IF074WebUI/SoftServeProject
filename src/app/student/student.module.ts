import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {studentRoutes} from './student.routes';
import {StudentComponent} from './student.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TestPlayerComponent} from './test-player/test-player.component';
import {LoginService} from '../login/login.service';
import {SpinnerService} from '../admin/universal/spinner/spinner.service';
import {LoadingModule} from 'ngx-loading';
import {TimetableService} from '../admin/timetable/timetable.service';
import {SubjectService} from '../admin/subject/subject.service';
import {TestsService} from '../admin/services/tests.service';
import {QuestionsService} from '../admin/services/questions.service';
import {AnswersService} from '../admin/services/answers.service';
import {TestDetailService} from '../admin/test-detail/test-detail.service';
import {DeleteRecordByIdService} from '../admin/services/delete-record-by-id.service';
import {TestPlayerService} from './test-player/test-player.service';
import {GetTestsBySubjectService} from '../admin/services/get-tests-by-subject.service';
import {CommonModule} from '@angular/common';
import {StudentsService} from '../admin/students/students.service';
import {ResultsService} from '../admin/services/results.service';

@NgModule({

  declarations: [StudentComponent, TestPlayerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(studentRoutes),
    LoadingModule
  ],
  providers: [
    TestPlayerService,
    GetTestsBySubjectService,
    StudentsService,
    ResultsService,
    LoginService,
    SpinnerService,
    TimetableService,
    SubjectService,
    TestsService,
    QuestionsService,
    AnswersService,
    TestDetailService,
    DeleteRecordByIdService,
    GetTestsBySubjectService
  ]
})

export class StudentModule {
}


