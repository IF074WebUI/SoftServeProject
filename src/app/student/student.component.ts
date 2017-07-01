import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login/login.service';
import {Router} from '@angular/router';
import { StudentsService } from '../admin/students/students.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {ResultsService} from "../admin/services/results.service";
import {ToastsManager} from "ng2-toastr";
import {SpinnerService} from "../admin/universal/spinner/spinner.service";
import {TimetableService} from "../admin/timetable/timetable.service";
import { StudentParameters } from './StudentParameters';
import {SubjectService} from "../admin/subject/subject.service";
import {TestsService} from "../admin/services/tests.service";
import {QuestionsService} from "../admin/services/questions.service";
import {AnswersService} from "../admin/services/answers.service";
import {TestDetailService} from "../admin/test-detail/test-detail.service";
import {DeleteRecordByIdService} from "../admin/services/delete-record-by-id.service";
@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
studentId: number;
studentFullName: string;
objLoaderStatus: boolean;
noTests: string;
noRecordsResponce: string;
checkTestAvailability: boolean;
result: StudentParameters;

  constructor(private loginService: LoginService,
              private router: Router,
              private studentService: StudentsService,
              private resultsService: ResultsService,
              private spinner: SpinnerService,
              private toastr: ToastsManager,
              private timeTable: TimetableService,
              private subject: SubjectService,
              private test: TestsService,
              private question: QuestionsService,
              private answer: AnswersService,
              private teestDetail: TestDetailService,
              private deleteRecords: DeleteRecordByIdService
  ) {
    this.objLoaderStatus = false;
    this.noTests = 'Немає доступних тестів';
    this.noRecordsResponce = 'no records';
    this.checkTestAvailability = false;
  }

ngOnInit() {
  this.spinner.loaderStatus.subscribe((val: boolean) => {
    this.objLoaderStatus = val;
  });
this.getStudentId();
this.getTests();
}
  saveGroupId() {
  console.log(window.sessionStorage.getItem('studentId'));
}
getStudentId() {
  this.spinner.showSpinner();
  this.studentId = +window.sessionStorage.getItem('studentId');
  this.loginService.checkLogged()
      .subscribe(
        res => { this.spinner.hideSpinner(); },
        err => this.toastr.error(err)
      );
}
getTests() {
  let test = this.test.getTestsBySubject(this.result.subject[0].subject_id)
  let timeTable = this.timeTable.getTimeTablesForGroup(this.result.student['group_id']);
  this.studentService.getStudentById(+this.studentId).subscribe(res => {
    this.result['student'] = res[0];
    console.log(this.result['student'])
    Observable.forkJoin([timeTable, test]).subscribe(results => {
      this.result['groupId'] = +results[0][0]['group_id'];
      console.log(this.result['groupId']);
    });
  });


}
getTestForStudent() {
  this.spinner.showSpinner();
  this.studentService.getStudentById(this.studentId)
    .subscribe(
      res => {
        this.studentFullName = res[0]['student_surname'] + ' ' + res[0]['student_name'];
        this.timeTable.getTimeTablesForGroup(res.group_id)
          .subscribe( resTimeTable => {
            if (resTimeTable.response === this.noRecordsResponce ) {
              this.checkTestAvailability = true;
              console.log(resTimeTable);
              this.spinner.hideSpinner();
            } else {
              console.log('somesing went wrong :)');
              this.spinner.hideSpinner();
            }
          });
      },
      err => this.toastr.error(err),
      () => {}
    );
}
logout() {
  this.loginService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
