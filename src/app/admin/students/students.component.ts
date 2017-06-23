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
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';

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
              private getAllRecordsService: GetAllRecordsService,
              private spinner: SpinnerService,
              private toastr: ToastsManager) {}

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
    this.spinner.showSpinner();
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.getCount();
    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => {
        this.getStudentsWithGroupName(resp);
        this.spinner.hideSpinner();
      }, err => this.router.navigate(['/bad_request'])
        );
  }

  getCount(): void {
    this.studentsService.getCount().subscribe(resp => {
      this.count = resp;
    }, err => {
      this.toastr.error(err);
    });
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
    return {
      'username': Math.random().toString(36).substr(2, 8),
      'password': password,
      'password_confirm': password,
      'plain_password': password,
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
    console.log(this.generateStudentData()['photo']);
    this.studentsService.insert(value, this.generateStudentData()).subscribe(resp => {
        this.getStudents();
        this.popup.cancel();
        this.toastr.success(`Студент ${value['student_name']} ${value['student_surname']} ${value['student_fname']} успішно створений`);
      }, error2 => {
      this.toastr.error(error2);
    });
  }

  submitDelete(student: Student) {
    this.studentsService.deleteCascade(student['user_id']).subscribe(response => {
      this.getStudents();
      this.toastr.success(`Студент ${student['student_name']} ${student['student_surname']} ${student['student_fname']} успішно видалений`);
    }, error => {
      this.toastr.error(error);
      });
  }
}
/* Object {student_name: "ooolm", student_surname: "ioyfofuy", student_fname: "oiyfpyif", gradebook: "pyifpyif", email: "yi@ukr.net"…}attachment: ""email: "yi@ukr.net"gradebook: "pyifpyif"group: "5"group_id: ""photo: "data:image/jpeg;base64,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…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"student_fname: "oiyfpyif"student_name: "ooolm"student_surname: "ioyfofuy"user_id: ""__proto__: Object
 */
