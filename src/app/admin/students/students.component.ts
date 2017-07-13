import {Component, OnInit, ViewChild} from '@angular/core';
import {StudentsService} from './students.service';
import {Router} from '@angular/router';
import {Student} from './student';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../group/group';
import {GetRecordsByIdService} from '../services/get-records-by-id.service';
import {GetAllRecordsService} from '../services/get-all-records.service';
import {STUDENT_CONFIG} from '../universal/dynamic-form/config';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';
import {isUndefined} from "util";

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [StudentsService]
})

export class StudentsComponent implements OnInit {
  show: boolean = true;
  listRecycled: Array<string> = [];


  student: Student;
  AdminUser: Student;
  studentForEdit: Student;
  user_id: number;
  studentEditData = {};


  headers = ['№', 'Прізвище', 'Ім\'я', 'По-батькові', 'Група'];
  ignoreProperties = ['username', 'photo', 'user_id', 'group_id', 'gradebook_id', 'plain_password'];
  displayProperties = ['student_surname', 'student_name', 'student_fname', 'group_name'];
  sortProperties = ['student_surname', 'student_name', 'student_fname', 'group_name'];

  MAIN_HEADER = 'Студенти';
  MODAL_ADD = 'Додати студента';
  students: Student[];
  groups: Group[];
  page = 1;
  count: number;
  countPerPage = 5;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = STUDENT_CONFIG;

  constructor(private studentsService: StudentsService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private spinner: SpinnerService,
              private toastr: ToastsManager) {
  }

  ngOnInit() {
    // this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);

    this.getStudents();
    this.getAdminUser();
    this.getGroups();
    this.getStudentsForGroup();
    this.getStudentOne();
  }

  getStudentsForGroup() {
    const groupId = this.activatedRoute.snapshot.queryParams['group_id'];
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
        this.getStudentsUserData();
          this.spinner.hideSpinner();
        }, err => this.router.navigate(['/bad_request'])
      );
  }



  getStudentOne() {
    this.spinner.showSpinner();
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
      this.getStudentOneWithGroupName(resp[0]);
      this.spinner.hideSpinner();
    });
  }

  selectedStudent(student: Student, AdminUser) {
    this.studentForEdit = student;
    this.studentForEdit.username = AdminUser.username;
    this.studentForEdit.email = AdminUser.email;
    this.popup.sendItem({
      'student_name': this.studentForEdit.student_name,
      'student_surname': this.studentForEdit.student_surname,
      'student_fname': this.studentForEdit.student_fname,
      'gradebook': this.studentForEdit.gradebook_id,
      'email': this.studentForEdit.email,
      'group': this.studentForEdit.group_name,
      'group_id': this.studentForEdit.group_id
    }, 'Student', null, this.studentForEdit.photo);
    this.popup.showModal();
  }

  getAdminUser() {
    this.spinner.showSpinner();
    this.studentsService.getAdminUser(this.user_id).subscribe(resp => {
      this.AdminUser = resp[0];
      console.log(resp);
      this.spinner.hideSpinner();
    });
  }

  getStudentsUserData() {
    for (let student of this.students) {
      this.studentsService.getAdminUser(student.user_id)
        .subscribe(
          userResponse => {
            student.email = userResponse[0]['email'],
            student.username = userResponse[0]['username']
            // console.log(userResponse);
          }
        );
    }
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
    console.log(this.students);
  }

  getGroups() {
    this.getAllRecordsService.getAllRecords('group').subscribe((data) => {
      this.groups = data;
    });
  }

  getStudentOneWithGroupName(data) {
    this.student = data;
    this.getRecordsByIdService.getRecordsById('group', this.student.group_id).subscribe((StudentData) => {
      this.student.group_name = StudentData[0].group_name;
    });
  }

  goToStudentProfile(student: Student) {
    console.log(student.user_id);
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




  // edit(student: Student, AdminUser) {
  //   this.studentForEdit = student;
  //   this.studentForEdit.username = AdminUser.username;
  //   this.studentForEdit.email = AdminUser.email;
  //   this.popup.sendItem({
  //     'student_name': this.studentForEdit.student_name,
  //     'student_surname': this.studentForEdit.student_surname,
  //     'student_fname': this.studentForEdit.student_fname,
  //     'gradebook': this.studentForEdit.gradebook_id,
  //     'email': this.studentForEdit.email,
  //     'group': this.studentForEdit.group_name,
  //     'group_id': this.studentForEdit.group_id
  //   }, 'Student', null, this.studentForEdit.photo);
  //   this.popup.showModal();
  // }

  formSubmitted(value) {
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



  formSubmitt(value) {
    this.studentEditData = {
      'username': this.studentForEdit.username,
      'password': this.studentForEdit.plain_password,
      'password_confirm' : this.studentForEdit.plain_password,
      'plain_password': this.studentForEdit.plain_password,
    };
    this.studentsService.update(value, this.studentEditData, this.studentForEdit.user_id)
      .subscribe(resp => {
        this.getStudents();
        // this.getStudentsUserData();
        this.popup.cancel();
        this.toastr.success(`Студент ${this.studentForEdit['student_name']} ${this.studentForEdit['student_surname']}
        ${this.studentForEdit['student_fname']} успішно відредагований`);
      }, error2 => {
        this.toastr.error(error2);
      });
  }

}
