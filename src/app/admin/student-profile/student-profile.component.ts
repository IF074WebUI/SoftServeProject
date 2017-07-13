import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { Group } from '../group/group';
import { GetAllRecordsService } from '../services/get-all-records.service';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {STUDENT_CONFIG} from '../universal/dynamic-form/config';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss'],
  // providers: [StudentsService, GetRecordsByIdService, GetAllRecordsService]
})

export class StudentProfileComponent implements OnInit {
  groups: Group[];
  user_id: number;
  student: Student;
  AdminUser: Student;
  studentForEdit: Student;
  studentEditData = {};

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = STUDENT_CONFIG;


  constructor(private studentsService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService,
              private spinner: SpinnerService,
              private toastr: ToastsManager) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);
    this.getStudent();
    this.getAdminUser();
    this.getGroups();
  }

  getStudent() {
    this.spinner.showSpinner();
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
     this.getStudentsWithGroupName(resp[0]);
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
      this.spinner.hideSpinner();
    });
  }

  goToStudentResult() {
    this.router.navigate(['./results', this.user_id], {relativeTo: this.activatedRoute.parent});
  }

  getGroups() {
    this.spinner.showSpinner();
    this.getAllRecordsService.getAllRecords('group').subscribe((data) => {
      this.groups = data;
      this.spinner.hideSpinner();
    });
  }

  getStudentsWithGroupName(data) {
    this.student = data;
    this.getRecordsByIdService.getRecordsById('group', this.student.group_id).subscribe((StudentData) => {
      this.student.group_name = StudentData[0].group_name;
    });
  }

  formSubmitted(value) {
    this.studentEditData = {
      'username': this.studentForEdit.username,
      'password': this.studentForEdit.plain_password,
      'password_confirm' : this.studentForEdit.plain_password,
      'plain_password': this.studentForEdit.plain_password,
    };
    this.studentsService.update(value, this.studentEditData, this.user_id)
      .subscribe(resp => {
        this.getStudent();
        this.getAdminUser();
        this.popup.cancel();
        this.toastr.success(`Студент ${this.studentForEdit['student_name']} ${this.studentForEdit['student_surname']}
        ${this.studentForEdit['student_fname']} успішно відредагований`);
      }, error2 => {
        this.toastr.error(error2);
    });
  }
}


