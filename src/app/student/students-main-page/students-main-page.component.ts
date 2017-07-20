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
import {Test} from "../../admin/tests/test";
import {Student} from "../../admin/students/student";
import {TestPlayerData} from "../student-profile/TestPlayerData";
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
  result = {
    student: [],
    groupId: [],
    subjectId: [],
    tests: [],
    timeTable: []
  };
  tableHeaders: string[];
  unixTime: number;
  date: any;
  currentTime: any;
  clock: any;
  GREATINGS: string;
  OPEN_TESTS: string;
  PROFILE: string;
  testIdData: TestPlayerData = new TestPlayerData;
  unfinishedTests: any;
  logTime: number;
  logTest: number;
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
    this.OPEN_TESTS = 'Доступні до здачі тести';
    this.PROFILE = 'Профіль';
    this.noTests = 'Немає доступних тестів';
    this.noRecordsResponce = 'no records';
    this.checkTestAvailability = false;
    this.tableHeaders = ['#', 'Назва тесту', 'Кількість завданнь', 'Тривалість', ''];
    this.logTime = 0;
    this.logTest = 0;
    this.unfinishedTests = {
      test: [],
      startingTime: 0
    };
  }

  ngOnInit() {
    this.getTime();
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });
    this.getTestForStudent();
  }

  stopClock() {
    clearInterval(this.clock);
  }
  getTime() {
    this.testPlayer.getCurrentTime().subscribe(res => { this.unixTime = res['curtime'] * 10; } );
  }
  getTestForStudent() {
    this.getEndTime();
    this.loginService.checkLogged()
      .flatMap(loginResponse => this.studentId = loginResponse['id']);
        return this.loginService.checkLogged()
          .subscribe(result => {
            this.studentId = +result['id'];
            console.log(+result['id'])
            this.testIdData.studentId = +result['id'];
            this.testPlayer.addIdData(this.testIdData);
            this.studentService.getStudentById(+result['id'])
            .subscribe(res => {
              this.result.student = res[0];
              this.testPlayer.setStudentData(res[0])
              this.timeTable.getTimeTablesForGroup(this.result.student['group_id'])
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
                              this.result.tests = testsRes;
                            }
                          }, error => this.toastr.error(error)
                        );
                    };
                  };
                }, error => this.toastr.error(error)); }, error => this.toastr.error(error)); });
}
  logout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login'], error => this.toastr.error(error));
    });
    window.sessionStorage.setItem('studentId', 'false');
  }

  getTestIdData(testID: number, testDuration: number) {
    this.testIdData.studentId = this.result.student['user_id'];
    this.testIdData.testId = testID;
    this.testIdData.testDuration = testDuration;
    this.testIdData.startLogTime = this.logTime;
    this.testIdData.testLogId = this.logTest;
    this.testPlayer.addIdData(this.testIdData);
    this.router.navigate(['./student/test-player']);
  }

  goToTheProfile() {
    this.router.navigate(['./student/studentProfile']);
  }

  checkUfinishedTest() {
      this.testPlayer.getLogs(this.result.student['user_id'])
      .subscribe(
        LogResponse => {
          for (let log of LogResponse) {
              let logTime = log['log_time'].split(':');
              let logtStartTimeValue = (parseInt(logTime[0]) * this.SECONDS_IN_HOUR + parseInt(logTime[1]) * this.SECONDS_IN_MINUTE + parseInt(logTime[2]))  + Math.floor(Date.parse(log['log_date']) / this.MILISECONDS_IN_SECOND);
              if (this.logTime < logtStartTimeValue ) {
                this.logTime = logtStartTimeValue;
                this.logTest = +log['test_id'];
              }
            this.checkIsTimeLeft();
          };        console.log(this.logTime);
        }, error => this.toastr.error(error));
  }

  checkIsTimeLeft() {
    for (let test of this.result.tests) {
      if (+test['test_id'] === this.logTest && this.unixTime - this.logTime > test['time_for_test'] * this.SECONDS_IN_MINUTE) {
        this.logTime = 0;
      } else {
        this.testIdData.testId = this.logTest;
        this.testIdData.testLogDuration = test.time_for_test;

      }
    }
  }
  getEndTime() {
    this.testPlayer.getEndTime()
      .subscribe(res => {
        let time = JSON.parse(res);
        if (+time['endTime'] > 0) {
          this.testIdData.testId = time['testId'];
          this.testIdData.endUnixTime = time['endTime'];
          this.testIdData.testDuration = time['testDuration']
          this.testPlayer.addIdData(this.testIdData);
          this.router.navigate(['./student/test-player']);
        } else if (time['response'] === 'Empty set') {
          console.log(time);
        }
      }, err => console.log(err));
  }

}
