import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {studentRoutes} from './student.routes';
import {StudentComponent} from './student.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {StudentsMainPageComponent} from './students-main-page/students-main-page.component';
import {ToastModule} from 'ng2-toastr';
import {StudentProfileComponent} from './student-profile/student-profile.component';
import {GroupService} from '../admin/group/group.service';
import { TestRezultsComponent } from './test-rezults/test-rezults.component';


@NgModule({

  declarations: [StudentComponent, TestPlayerComponent, StudentsMainPageComponent, StudentProfileComponent, TestRezultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(studentRoutes),
    LoadingModule,
    ToastModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
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
    GetTestsBySubjectService,
    GroupService
  ]
})

export class StudentModule {
}


