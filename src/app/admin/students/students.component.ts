import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from './student';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../group/group';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';
import{ STUDENT_CONFIG } from '../universal/dynamic-form/config';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {FacultyService} from "../faculties/faculty.service";

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [StudentsService, FacultyService]
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
  MODAL_NAME = 'Ім\'я:';
  MODAL_SURNAME = 'Прізвище:';
  MODAL_F_NAME = 'Пo-батькові:';
  MODAL_ADD_ACTION = 'Додати';
  MODAL_CANSEL = 'Відміна';
  MODAL_DEL_HEADER = 'Видалення';
  MODAL_DEL_BODY = 'Ви дійсно хочете видалити студента?';
  MODAL_DEL = 'Видалити';
  MODAL_USERNAME = 'Логін:';
  MODAL_EMAIL = 'E-mail:';
  MODAL_GRADEBOOK = 'Залікова книжка:';
  MODAL_PHOTO = 'Фото:';
  // MODAL_EDIR_HEADER = 'Редагувати студента';
  // MODAL_EDIT = 'Редагувати';
  // MODAL_GROUP_NAME = 'Група:';
  MODAL_REQUIRED = 'Поле обов\'язкове до заповнення';


  studentForDel: Student;
  students: Student[];
  groups: Group[];
  page = 1;
  count: number;
  countPerPage = 10;

  studentForEdit;

  studentForm: FormGroup;
  // password = '' + Math.random();

  // studentEditData = {};
  studentEditForm: FormGroup;

  static generateStudentData() {
    const password = Math.random().toString(36).substr(2, 8);
    const username = 's' + Math.random().toFixed(3) + ' q' + Math.random().toFixed(3);
    const photo = '';
    return {
      'photo': photo,
      'username': username,
      'password': password,
      'password_confirm': password,
      'plain_password': password
    };
  }

  constructor(private studentsService: StudentsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService) {}

  ngOnInit() {
    this.getStudents();
    this.getGroups();
    this.getStudentsForGroup();

    // this.studentForm = new FormGroup({
    //   'group_id': new FormControl(''),
    //   'student_name': new FormControl('', Validators.required),
    //   'student_surname': new FormControl('', Validators.required),
    //   'student_fname': new FormControl('', Validators.required),
    //   'username': new FormControl('', Validators.required),
    //   'email': new FormControl('', Validators.required),
    //   'gradebook_id': new FormControl('', Validators.required),
    //   'photo': new FormControl('')
    // });
    //
    // this.studentEditForm = new FormGroup({
    //   'group_id': new FormControl(''),
    //   'student_surname': new FormControl(''),
    //   'student_name': new FormControl(''),
    //   'student_fname': new FormControl('')
    // });
    //
    // this.studentEditData = {
    //   'username' : 'test' + Math.random(),
    //   'password' : '1qaz2wsx',
    //   'password_confirm': '1qaz2wsx',
    //   'email' : '' + Math.random() + '@mail.if.ua',
    //   'gradebook_id' : '' + Math.random().toFixed(10),
    //   'plain_password' : '' + Math.random(),
    //   'photo' : ''
    // };
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

  // selectedStudentForEdit(student: Student) {
  //   this.studentForEdit = student;
  //   this.studentEditForm.setValue({
  //     'group_id': student.group_id,
  //     'student_surname': student.student_surname,
  //     'student_name': student.student_name,
  //     'student_fname': student.student_fname
  //   });
  // }

  selectedStudentForDel(student: Student) {
    this.studentForDel = student;
  }

  deleteStudent() {
     this.studentsService.delete(this.studentForDel['user_id']).subscribe(resp => {
       this.getStudents();
     });
  }

  // addStudent() {
  //   this.studentsService.insert(this.studentForm.value, StudentsComponent.generateStudentData()).subscribe(resp => {
  //     this.getStudents();
  //   });
  //   this.studentForm.reset();
  // }

  // editStudent() {
  //   this.studentsService.update(this.studentEditForm.value, this.studentEditData, this.studentForEdit['user_id']).subscribe(resp => {
  //     this.getStudents();
  //   });
  //   this.studentEditForm.reset();
  // }

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

  add() {
    this.popup.sendItem(new Student());
    this.popup.showModal();
  }

  edit(student: Student) {
    this.studentForEdit = student;
    this.getRecordsByIdService.getRecordsById('AdminUser', this.studentForEdit.user_id).subscribe(data => {
      this.studentForEdit.email = data[0].email;
    });
    if (this.studentForEdit.email) {
      this.popup.sendItem(
        {
          student_name: this.studentForEdit.student_name,
          student_surname: this.studentForEdit.student_surname,
          student_fname: this.studentForEdit.student_fname,
          gradebook: this.studentForEdit.gradebook_id,
          email: this.studentForEdit.email,
          group: this.studentForEdit.group_name,
          group_id: this.studentForEdit.group_id,
          user_id: this.studentForEdit.user_id
        }
      );
      this.popup.showModal();
    }
  }

  del(student: Student) {
    this.popup.deleteEntity(student);
  }

  formSubmitted(value) {
    this.studentForEdit = value;
    if (value['user_id']) {
      this.studentsService.update(value, StudentsComponent.generateStudentData()).subscribe(resp => {
        this.getStudents();
        this.popup.cancel();
      }, error2 => this.router.navigate(['/bad_request']));
    } else {
      this.studentsService.insert(value, StudentsComponent.generateStudentData()).subscribe(resp => {
        this.getStudents();
        this.popup.cancel();
      }, error2 => this.router.navigate(['/bad_request']));
    }
  }

  submitDelete(student: Student) {
    this.studentsService.delete(student['user_id']).subscribe(response => this.getStudents(),
      error => this.router.navigate(['/bad_request'])
    );
  }
}
