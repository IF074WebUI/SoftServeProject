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
  date: any;
  GREATINGS: string;
  OPEN_TESTS: string;
  PROFILE: string;
  testIdData: TestPlayerData = new TestPlayerData;

  constructor(private loginService: LoginService,
              private router: Router,
              private studentService: StudentsService,
              private spinner: SpinnerService,
              private toastr: ToastsManager,
              private timeTable: TimetableService,
              private test: TestsService,
              private testPlayer: TestPlayerService,
  ) {

    this.objLoaderStatus = false;
    this.GREATINGS = 'Доброго дня';
    this.OPEN_TESTS = 'Доступні до здачі тести';
    this.PROFILE = 'Профіль';
    this.noTests = 'Немає доступних тестів';
    this.noRecordsResponce = 'no records';
    this.checkTestAvailability = false;
    this.tableHeaders = ['#', 'Назва тесту', 'Кількість завданнь', 'Тривалість', ''];
  }

  ngOnInit() {
    this.getTestForStudent();
  }

  getTestForStudent() {
    this.spinner.showSpinner();
    this.getEndTime();
    this.loginService.checkLogged()
          .subscribe(result => {
            this.studentId = +result['id'];
            this.testIdData.studentId = +result['id'];
            this.testPlayer.addIdData(this.testIdData);
            this.studentService.getStudentById(+result['id'])
            .subscribe(res => {
              this.result.student = res[0];
              this.testPlayer.setStudentData(res[0]);
              this.timeTable.getTimeTablesForGroup(this.result.student['group_id'])
                .subscribe(timeTableRes => {
                  if (timeTableRes['response'] === this.noRecordsResponce) {
                    this.checkTestAvailability = true;
                    this.spinner.hideSpinner();
                  } else {
                    this.result.timeTable = timeTableRes;
                    for (const timeTable of this.result.timeTable) {
                      this.test.getTestsBySubject(timeTable['subject_id'])
                        .subscribe(testsRes => {
                            if (testsRes['response'] === this.noRecordsResponce) {
                              this.checkTestAvailability = true;
                              this.spinner.hideSpinner();
                            } else {
                              this.result.tests = testsRes;
                              this.spinner.hideSpinner();
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
    this.testPlayer.addIdData(this.testIdData);
    this.router.navigate(['./student/test-player']);
  }

  getEndTime() {
    this.testPlayer.getEndTime()
      .subscribe(res => {
        let time = JSON.parse(res);
        if (+time['endTime'] !== undefined) {
          this.testIdData.testId = time.testId;
          this.testIdData.endUnixTime = time.endTime;
          this.testIdData.testDuration = time.testDuration;
          this.testIdData.testName = time.testName;
          this.testPlayer.addIdData(this.testIdData);
          this.router.navigate(['./student/test-player']);
        } else if (time['response'] === 'Empty set') {
        }
      }, err => this.toastr.error(err));
  }

}
