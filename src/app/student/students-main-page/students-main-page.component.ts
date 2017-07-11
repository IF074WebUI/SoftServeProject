import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentsService} from '../../admin/students/students.service';
import {ResultsService} from '../../admin/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {ToastsManager} from 'ng2-toastr';
import {SpinnerService} from '../../admin/universal/spinner/spinner.service';
import {TimetableService} from '../../admin/timetable/timetable.service';
import {SubjectService} from '../../admin/subject/subject.service';
import {TestsService} from '../../admin/services/tests.service';
import {QuestionsService} from '../../admin/services/questions.service';
import {AnswersService} from '../../admin/services/answers.service';
import {TestDetailService} from '../../admin/test-detail/test-detail.service';
import {DeleteRecordByIdService} from '../../admin/services/delete-record-by-id.service';
import {TestPlayerService} from '../test-player/test-player.service';
@Component({
  selector: 'dtester-students-main-page',
  templateUrl: './students-main-page.component.html',
  styleUrls: ['./students-main-page.component.scss']
})
export class StudentsMainPageComponent implements OnInit {
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
  clock: any;
  GREATINGS: string;
  OPEN_TESTS: string;
  PROFILE: string;
  testIdData: any;
  unfinishedTests: any;
  SECONDS_IN_HOUR = 3600;
  SECONDS_IN_MINUTE = 60;
  MILISECONDS_IN_SECOND = 1000;
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
    this.GREATINGS = 'Доброго дня';
    this.OPEN_TESTS = 'Доступні';
    this.PROFILE = 'Профіль';
    this.noTests = 'Немає доступних тестів';
    this.noRecordsResponce = 'no records';
    this.checkTestAvailability = false;
    this.tableHeaders = ['#', 'Назва тесту', 'Кількість завданнь', 'Тривалість', ''];
    // this.studentId = +window.sessionStorage.getItem('studentId');
    this.result = {
      student: [],
      groupId: [],
      subjectId: [],
      tests: [],
      timeTable: []
    };
    this.testIdData = {
      studentId: 0 ,
      testId: 0,
      testDuration: 0
    };
    this.unfinishedTests = {
      test: [],
      startingTime: 0
    };
  }

  ngOnInit() {
    this.testPlayer.getCurrentTime().subscribe(res => console.log(res))
    this.getTestForStudent();
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });
  }

  getStudentId() {
    this.spinner.showSpinner();
    this.loginService.checkLogged()
      .subscribe(
        res => {this.studentId = res[0]; this.spinner.hideSpinner()},
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
  getTestForStudent() {
    this.loginService.checkLogged()
      .flatMap(loginResponse => this.studentId = loginResponse['id'])
        return this.loginService.checkLogged()
          .subscribe(result => { this.studentService.getStudentById(+result['id'])
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
                                if (test['enabled'] === '1') {
                                  this.result.tests.push(test);
                                };
                              }
                            }
                          }, error => this.toastr.error(error)
                        );
                    };
                  };
                }, error => this.toastr.error(error)); }, error => this.toastr.error(error)); });
}
  logout() {
    this.stopClock();
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login'], error => this.toastr.error(error));
    });
    window.sessionStorage.setItem('studentId', 'false');
  }

  getTestIdData(testID: number, testDuration: number) {
    this.testIdData.studentId = this.result.student.user_id;
    this.testIdData.testId = testID;
    this.testIdData.testDuration = testDuration;
    this.testPlayer.addIdData(this.testIdData);
    this.router.navigate(['./test-player'],
      {
        queryParams: {
          'testId': 5,
          'test_duration': 6
        },
        relativeTo: this.route.parent});
  }
  openTestPlayer(testId, testDuration) {
    this.stopClock();
    this.router.navigate(['./test-player'],
      {
        queryParams: {'testId': testId,
          'test_duration': testDuration
        },
        relativeTo: this.route.parent});
  }
  goToTheProfile() {
    this.router.navigate(['./studentProfile'], {
      queryParams: {'user_id': this.result.student['user_id']},
      relativeTo: this.route.parent
    });
  }

  checkUfinishedTest() {
    this.testPlayer.getLogs(this.result.student['user_id'])
      .subscribe(
        LogResponse => {
          for (let log of LogResponse) {
            let logTime = log['log_time'].split(':');
            let logtStartTimeValue = (parseInt(logTime[0]) * this.SECONDS_IN_HOUR + parseInt(logTime[1]) * this.SECONDS_IN_MINUTE + parseInt(logTime[2])) * 1000  + Date.parse(log['log_date']);
            this.test.getTestById(log['test_id'])
              .subscribe(
                responce => {
                  this.unfinishedTests.test.push(responce[0], logtStartTimeValue);
                }, error => this.toastr.error(error));
          }
          console.log(this.unfinishedTests); }, error => this.toastr.error(error));
  }

}
