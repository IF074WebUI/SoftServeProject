import { Component, OnInit } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { AddEditDeleteService } from './add-edit-delete.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Student } from './student';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {

  headers: string[] = [];
  ignoreProperties: string[] = [];
  mainHeader = 'Студенти';

  modalAdd = 'Додати студента';
  modalName = 'Ім\'я:';
  modalSurname = 'Прізвище:';
  modalFname = 'Пo-батькові:';
  modalPassword = 'Пароль:';
  modalConfirmPassword = 'Підтвердіть пароль:';
  modalAddAction = 'Додати';
  modalCansel = 'Відміна';
  modalDelHeader = 'Видалення';
  modalDelBody = 'Ви дійсно хочете видалити студента?';
  modalDel = 'Видалити';
  modalEditHeader = 'Редагувати студента';
  modalEdit = 'Редагувати';

  student: Student = new Student();
  studentForEdit: Student;
  studentForDel: Student;
  students: Student[];
  page = 1;
  count: number;
  countPerPage = 10;

  studentName: FormControl;
  studentSurname: FormControl;
  studentFname: FormControl;
  studentPassword: FormControl;
  studentPasswordConfirm: FormControl;
  studentForm: FormGroup;
  studentEmail: string;
  studentGradebookId: string;
  studentUsername: string;
  studentPhoto: any;
  studentGroupId: number;
  studentPlainPassword: string;

  studentEditName: FormControl;
  studentEditSurname: FormControl;
  studentEditFname: FormControl;
  studentEditPassword: string;
  studentEditPasswordConfirm: string;
  studentEditForm: FormGroup;
  studentEditEmail: string;
  studentEditGradebookId: string;
  studentEditUsername: string;
  studentEditPhoto: any;
  studentEditGroupId: number;
  studentEditPlainPassword: string;
  studentUser_id: FormControl;

  constructor(private studentsService: StudentsService, private addEditDeleteService: AddEditDeleteService,
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.headers = ['№', 'Прізвище', 'Ім\'я', 'По-батькові'];
    this.ignoreProperties = ['username', 'photo', 'user_id', 'group_id', 'gradebook_id', 'plain_password'];
    this.studentsService.getAllStudents().subscribe((data) => {
      this.students = data;
    });
    this.getStudents();
    this.getCount();

    const  groupId = this.route.snapshot.queryParams['group_id'];
    if (groupId) {
      this.studentsService.getStudentsByGroupId(groupId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.students = [];
        } else {
          this.students = resp;
        }
      });
    }

    this.studentName = new FormControl('');
    this.studentSurname = new FormControl('');
    this.studentFname = new FormControl('');
    this.studentPassword = new FormControl('');
    this.studentPasswordConfirm = new FormControl('');
    this.studentForm = new FormGroup({
      'name': this.studentName,
      'surname': this.studentSurname,
      'f_name': this.studentFname,
      'password': this.studentPassword,
      'password_confirm': this.studentPasswordConfirm
    });

    this.studentEditName = new FormControl('');
    this.studentEditSurname = new FormControl('');
    this.studentEditFname = new FormControl('');
    this.studentUser_id = new FormControl('');
    this.studentEditForm = new FormGroup({
      'editName': this.studentEditName,
      'editSurname': this.studentEditSurname,
      'editF_name': this.studentEditFname,
      'user_id': this.studentUser_id
    });
  }

  getStudents(): void {
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }
    this.getCount();
    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.students = resp, err => this.router.navigate(['/bad_request']));
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

  selectedStudent(student: Student) {
    this.studentForDel = student;
    this.studentForEdit = student;
  }

  deleteStudent() {
     this.addEditDeleteService.delete(this.studentForDel['user_id']).subscribe(resp => {
       this.getStudents();
     });
  }

  addStudent() {
    this.addEditDeleteService.insert(
      this.studentUsername = 'test' + Math.random(),
      this.studentPassword.value,
      this.studentPasswordConfirm.value,
      this.studentEmail = 'test' + Math.random() + '@mail.if.ua',
      this.studentGradebookId = 'If-' + Math.random().toFixed(9),
      this.studentSurname.value,
      this.studentName.value,
      this.studentFname.value,
      this.studentGroupId = 1,
      this.studentPlainPassword = '1qaz2wsx',
      this.studentPhoto = ''
    ).subscribe(resp => {
      this.getStudents();
    });
    this.studentForm.reset();
  }

  editStudent() {
    this.studentUser_id.setValue(this.studentForEdit['user_id']);
    this.addEditDeleteService.update(
      this.studentEditUsername = 'test' + Math.random(),
      this.studentEditPassword = '1qaz2wsx',
      this.studentEditPasswordConfirm = '1qaz2wsx',
      this.studentEditEmail = 'test' + Math.random() + '@mail.if.ua',
      this.studentEditGradebookId = 'If-' + Math.random().toFixed(9),
      this.studentEditSurname.value,
      this.studentEditName.value,
      this.studentEditFname.value,
      this.studentEditGroupId = 1,
      this.studentEditPlainPassword = '1qaz2wsx',
      this.studentEditPhoto = '',
      this.studentUser_id.value
    ).subscribe(resp => {
      this.getStudents();
    });
    this.studentEditForm.reset();
  }
}
