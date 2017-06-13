import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../students/student';
import { StudentsService } from '../students/students.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { DynamicFormComponent } from  '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';

@Component({
  selector: 'dtester-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
  providers: [StudentsService]
})
export class StudentProfileComponent implements OnInit {

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;

  user_id: number;
  student: Student;
  AdminUser: Student;
  studentForEdit: Student;

  constructor(private studentsService: StudentsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private getRecordsByIdService: GetRecordsByIdService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(resp => this.user_id = resp['user_id']);
    this.getStudent();
    this.getAdminUser();
    }

  getStudent() {
    this.studentsService.getStudentById(this.user_id).subscribe((resp: Student) => {
     this.student = resp[0];
   });
   }

  getAdminUser() {
    this.studentsService.getAdminUser(this.user_id).subscribe(resp => {
      this.AdminUser = resp[0];
    });
  }

  goToStudentResult() {
    this.router.navigate(['./results', this.user_id], {relativeTo: this.activatedRoute.parent});
  }

  getStudentEmail(data) {
    this.studentForEdit = data;
    this.getRecordsByIdService.getRecordsById('AdminUser', this.user_id).subscribe(resp => this.student.email = resp[0].email);
  }

  getStudentUsername(data) {
    this.studentForEdit = data;
    this.getRecordsByIdService.getRecordsById('AdminUser', this.user_id).subscribe(resp => this.student.username = resp[0].username);
  }

  edit(student) {
    this.studentForEdit = student;
    console.log(student);
    this.getStudentUsername(student);
    this.getStudentEmail(student);
    if (this.student.email) {
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
}


