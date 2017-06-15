import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { Student } from './student';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../group/group';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { STUDENT_CONFIG } from '../universal/dynamic-form/config';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [StudentsService]
})
export class StudentsComponent implements OnInit {

  headers = ['№', 'Прізвище', 'Ім\'я', 'По-батькові', 'Група'];
  ignoreProperties = ['username', 'photo', 'user_id', 'group_id', 'gradebook_id', 'plain_password'];
  displayProperties = ['student_surname', 'student_name', 'student_fname', 'group_name'];
  sortProperties = ['student_surname', 'student_name', 'student_fname', 'group_name'];

  configs = STUDENT_CONFIG;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  MAIN_HEADER = 'Студенти';
  MODAL_ADD = 'Додати студента';
  students: Student[];
  groups: Group[];
  page = 1;
  count: number;
  countPerPage = 10;

  constructor(private studentsService: StudentsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService) {}

  ngOnInit() {
    this.getStudents();
    this.getGroups();
    this.getStudentsForGroup();
  }

  getStudentsForGroup() {
    const  groupId = this.activatedRoute.snapshot.queryParams['group_id'];
    if (groupId) {
      this.studentsService.getStudentsByGroupId(groupId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.students = [];
        } else {
          this.getStudentsWithGroupName(resp);
        }
      });
    }
  }

  getStudents(): void {
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.getCount();
    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.getStudentsWithGroupName(resp),
        err => this.router.navigate(['/bad_request'])
        );
  }

  getCount(): void {
    this.studentsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {
    this.page = page;
    this.getStudents();
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getStudents();
  }

  searchStudent(criteria: string) {
    this.studentsService.searchByName(criteria).subscribe(resp => {
      if (resp['response'] === 'no records') {
        this.students = [];
      } else {
        this.students = resp;
        this.count = this.students.length;
      }
      if (criteria === '') {
        this.getStudents();
      }
    });
  }

  getStudentsWithGroupName(data) {
    this.students = data;
    for (const student of this.students) {
      this.getRecordsByIdService.getRecordsById('group', student.group_id).subscribe((StudentData) => {
        student.group_name = StudentData[0].group_name;
      });
    }
  }

  getGroups() {
    this.getAllRecordsService.getAllRecords('group').subscribe((data) => {
      this.groups = data;
    });
  }

  goToStudentProfile(student: Student) {
    this.router.navigate(['students', student.user_id], {relativeTo: this.activatedRoute.parent});
  }

  generateStudentData() {
    const password = Math.random().toString(36).substr(2, 8);
    const username = 's' + Math.random().toFixed(3) + ' q' + Math.random().toFixed(3);
    const photo = '';
    return {
      'username': username,
      'password': password,
      'password_confirm': password,
      'plain_password': password,
      'photo': photo
    };
  }

  add() {
    this.popup.sendItem(new Student(), 'Student');
    this.popup.showModal();
  }

  del(student: Student) {
    this.popup.deleteEntity(student);
  }

  formSubmitted(value) {
      this.studentsService.insert(value, this.generateStudentData()).subscribe(resp => {
        this.getStudents();
        this.popup.cancel();
      }, error2 => this.router.navigate(['/bad_request']));
  }

  submitDelete(student: Student) {
    this.studentsService.del(student['user_id']).subscribe(response => this.getStudents(),
      error => this.router.navigate(['/bad_request'])
    );
  }
}
