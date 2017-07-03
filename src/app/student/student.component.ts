import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentsService} from '../admin/students/students.service';
import {ResultsService} from '../admin/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {ToastsManager} from 'ng2-toastr';
import {SpinnerService} from '../admin/universal/spinner/spinner.service';
import {TimetableService} from '../admin/timetable/timetable.service';
import { StudentParameters } from './StudentParameters';
import {SubjectService} from '../admin/subject/subject.service';
import {TestsService} from '../admin/services/tests.service';
import {QuestionsService} from '../admin/services/questions.service';
import {AnswersService} from '../admin/services/answers.service';
import {TestDetailService} from '../admin/test-detail/test-detail.service';
import {DeleteRecordByIdService} from '../admin/services/delete-record-by-id.service';
import {TestPlayerService} from './test-player/test-player.service';
import {subscribeToResult} from "rxjs/util/subscribeToResult";
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
  result: any;
  tableHeaders: string[];
  unixTime: number;
  date: any;
  currentTime: string;
  clock:any;
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
                private deleteRecords: DeleteRecordByIdService,
                private testPlayer: TestPlayerService,
                private route: ActivatedRoute,
    ) {
      this.objLoaderStatus = false;
      this.noTests = 'Немає доступних тестів';
      this.noRecordsResponce = 'no records';
      this.checkTestAvailability = false;
      this.tableHeaders = ['#', 'Назва тесту', 'Кількість завданнь', 'Тривалість', ''];
      this.studentId = +window.sessionStorage.getItem('studentId');
      this.result = {
        student: [],
        groupId: [],
        subjectId: [],
        tests: [],
        timeTable: []
      };
    }

ngOnInit() {
      this.getTestForStudent();
  this.spinner.loaderStatus.subscribe((val: boolean) => {
    this.objLoaderStatus = val;
  });
// this.getStudentId();
// this.getTests();
// this.clock = setInterval(() => {
//   this.getTime();
//   this.date = new Date(this.unixTime * 1000);
//   this.currentTime = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
//   }, 1000);
}

getStudentId() {
  this.spinner.showSpinner();
  this.loginService.checkLogged()
      .subscribe(
        res => {},
        err => this.toastr.error(err)
      );
}
showTime() {
    setInterval(() => {
      this.getTime();
      this.date = new Date(this.unixTime * 1000);
      this.currentTime = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
    }, 1000);
    this.spinner.hideSpinner();
}
stopClock() {
  clearInterval(this.clock);
  }
getTime() {
    this.testPlayer.getCurrentTime().subscribe(res => { this.unixTime = res['curtime']; } );
}
getTests() {
    Observable.forkJoin([
      this.studentService.getStudentById(+this.studentId),
      this.timeTable.getTimeTablesForGroup(1),
      this.test.getTestsBySubject(3)
    ]).subscribe(results => {
      this.result.subjectId = results[1];
      this.result.tests = results[2];
      this.result.student = results[0][0];
      // this.result['groupId'] = +results[1]['group_id'];
      this.spinner.hideSpinner();
    });


}
getTestForStudent() {
  // this.spinner.showSpinner();
  this.studentService.getStudentById(this.studentId)
    .subscribe(res => {
      this.result.student = res[0];
        this.timeTable.getTimeTablesForGroup(this.result.student.group_id)
          .subscribe(timeTableRes => {
            if (timeTableRes['response'] === this.noRecordsResponce) {
              this.checkTestAvailability = true;
            } else {
              this.result.timeTable = timeTableRes;
              for (const timeTable of this.result.timeTable) {
                this.test.getTestsBySubject(timeTable['subject_id'])
                  .subscribe(testsRes => {
                      if (testsRes['response'] === this.noRecordsResponce) {
                        this.checkTestAvailability = true;
                      } else {
                        for (const test of testsRes) {
                          this.result.tests.push(test);
                        }
                      }
                    }
                  );
              };
            };
          }); });
  console.log(this.result);
}
logout() {
    this.stopClock();
  this.loginService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
  openTestPlayer(testId) {
    this.stopClock();
    this.router.navigate(['./test-player'],
      {
        queryParams: {'testId': testId,
          'user_id': this.result.student['user_id']
        },
      relativeTo: this.route.parent});
  }

}
