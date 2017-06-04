import { Component, OnInit } from '@angular/core';
import { StudentsService} from './students.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Student } from './student';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../group/group';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';
import { GetAllRecordsService } from '../services/get-all-records.service';

@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [StudentsService]
})
export class StudentsComponent implements OnInit {

  headers: string[] = [];
  ignoreProperties: string[] = [];
  displayProperties: string[] = [];

  MAIN_HEADER = 'Студенти';
  MODAL_ADD = 'Додати студента';
  MODAL_NAME = 'Ім\'я:';
  MODAL_SURNAME = 'Прізвище:';
  MODAL_F_NAME = 'Пo-батькові:';
  MODAL_PASSWORD = 'Пароль:';
  MODAL_CONFIRM_PASSWORD = 'Підтвердіть пароль:';
  MODAL_ADD_ACTION = 'Додати';
  MODAL_CANSEL = 'Відміна';
  MODAL_DEL_HEADER = 'Видалення';
  MODAL_DEL_BODY = 'Ви дійсно хочете видалити студента?';
  MODAL_DEL = 'Видалити';
  MODAL_EDIR_HEADER = 'Редагувати студента';
  MODAL_EDIT = 'Редагувати';

  student: Student = new Student();
  studentForEdit: Student;
  studentForDel: Student;
  students: Student[];
  groups: Group[];
  page = 1;
  count: number;
  countPerPage = 10;

  studentData = {};
  studentName: FormControl;
  studentSurname: FormControl;
  studentFname: FormControl;
  studentPassword: FormControl;
  studentPasswordConfirm: FormControl;
  studentForm: FormGroup;
  studentEmail = 'test' + Math.random() + '@mail.if.ua';
  studentGradebookId = 'If-' + Math.random().toFixed(9);
  studentUsername = 'test' + Math.random();
  studentPhoto = '';
  studentGroupId = 1;
  studentPlainPassword = '1qaz2wsx';

  studentEditData = {};
  studentEditName: FormControl;
  studentEditSurname: FormControl;
  studentEditFname: FormControl;
  studentEditPassword = '1qaz2wsx';
  studentEditPasswordConfirm = '1qaz2wsx';
  studentEditForm: FormGroup;
  studentEditEmail = 'test' + Math.random() + '@mail.if.ua';
  studentEditGradebookId = 'If-' + Math.random().toFixed(9);
  studentEditUsername = 'test' + Math.random();
  studentEditPhoto = '';
  studentEditGroupId = 1;
  studentEditPlainPassword = '1qaz2wsx';

  constructor(private studentsService: StudentsService,
              private router: Router,
              private route: ActivatedRoute,
              private getRecordsByIdService: GetRecordsByIdService,
              private getAllRecordsService: GetAllRecordsService) {}

  ngOnInit() {
    this.headers = ['№', 'Прізвище', 'Ім\'я', 'По-батькові', 'Група'];
    this.ignoreProperties = ['username', 'photo', 'user_id', 'group_id', 'gradebook_id', 'plain_password'];
    this.displayProperties = ['student_surname', 'student_name', 'student_fname', 'group_name'];
    this.getStudents();
    this.getGroups();
    this.getStudentsByGroupId();

    this.studentName = new FormControl('');
    this.studentSurname = new FormControl('');
    this.studentFname = new FormControl('');
    this.studentPassword = new FormControl('');
    this.studentPasswordConfirm = new FormControl('');
    this.studentForm = new FormGroup({
      'group_id': new FormControl(''),
      'student_name': this.studentName,
      'student_surname': this.studentSurname,
      'student_fname': this.studentFname,
      'password': this.studentPassword,
      'password_confirm': this.studentPasswordConfirm
    });

    this.studentEditName = new FormControl('');
    this.studentEditSurname = new FormControl('');
    this.studentEditFname = new FormControl('');
    this.studentEditForm = new FormGroup({
      'group_id': new FormControl(''),
      'editName': this.studentEditName,
      'editSurname': this.studentEditSurname,
      'editF_name': this.studentEditFname
    });

    this.studentData = {
      'username' : this.studentUsername,
      'email' : this.studentEmail,
      'gradebook_id' : this.studentGradebookId,
      'group_id' : this.studentGroupId,
      'plain_password' : this.studentPlainPassword,
      'photo' : this.studentPhoto
    };

    this.studentEditData = {
      'username' : this.studentEditUsername,
      'password' : this.studentEditPassword,
      'password_confirm': this.studentEditPasswordConfirm,
      'email' : this.studentEditEmail,
      'gradebook_id' : this.studentEditGradebookId,
      'group_id' : this.studentEditGroupId,
      'plain_password' : this.studentEditPlainPassword,
      'photo' : this.studentEditPhoto
    };
  }

  getStudentsByGroupId() {
    let  groupId = this.route.snapshot.queryParams['group_id'];
    if (groupId) {
      this.studentsService.getStudentsByGroupId(groupId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.students = [];
        } else {
          this.getGroupName(resp);
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
      .subscribe(resp => this.getGroupName(resp), err => this.router.navigate(['/bad_request']));
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
     this.studentsService.delete(this.studentForDel['user_id']).subscribe(resp => {
       this.getStudents();
     });
  }

  addStudent() {
    this.studentsService.insert(this.studentForm.value, this.studentData).subscribe(resp => {
      this.getStudents();
    });
    this.studentForm.reset();
  }

  editStudent() {
    this.studentsService.update(this.studentEditForm.value, this.studentEditData, this.studentForEdit['user_id']).subscribe(resp => {
      this.getStudents();
    });
    this.studentEditForm.reset();
  }

  searchStudent(criteria: string){
    this.studentsService.searchByName(criteria).subscribe(resp => {
      if (resp['response'] === 'no records') {
        this.students = [];
      } else {
        this.students = <Student[]> resp;
        this.count = this.students.length;
      }
    });
  }

  getGroupName(data) {
    this.students = data;
    for (let student of this.students) {
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
}
