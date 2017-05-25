import {Component, OnInit} from '@angular/core';
import {StudentsService} from './students.service';
import {Router} from '@angular/router';
import {MdDialog} from '@angular/material';
import {AddStudentComponent} from './add-student/add-student.component';
import {EditStudentComponent} from './edit-student/edit-student.component';
import {DeleteStudentComponent} from './delete-student/delete-student.component';
import {AddEditDeleteService} from './add-edit-delete.service';
import {FormControl} from '@angular/forms';
import {Student} from './student';
@Component({
  selector: 'dtester-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {
  student: Student = new Student();
  studentUser_id: FormControl;
  studentForEdit: Student;
  studentForDel: Student;
  students = [];
  // studentsOnPage: any = [];
  page = 1;
  count: number;
  countPerPage = 10;
  // headers: string[];            /* array of headers */
  editId = 0;
  /* id of edited student (if student is adding than 0 or undefined) */
  // numberOfrecords: number;
  // // pageNumber = 1;
  // offset = 10;
  // selectedValue: number;
  // selectedStudentsValue: number;


  constructor(private dialog: MdDialog, private studentsService: StudentsService, private router: Router, private http: AddEditDeleteService) {
  }

  ngOnInit() {
    this.studentsService.getAllStudents().subscribe((data) => {
      this.students = data;
      console.log(this.students);
    });
    this.getStudents();
    this.getCount();
  }

  selectedStudent(student: Student) {
    this.studentForEdit = student;
    this.studentForDel = student;
  }

  getStudents(): void {
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.count <= (this.page - 1) * this.countPerPage) {
      --this.page;
    }

    this.studentsService.getPaginated(this.countPerPage, (this.page - 1) * this.countPerPage)
      .subscribe(resp => this.students = resp, err => this.router.navigate(['/bad_request']));
  }

  getCount(): void {
    this.studentsService.getCount().subscribe(resp => this.count = resp,
      err => this.router.navigate(['/bad_request']));
  }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.page = page;
    this.getStudents();
    /* request new specialilies for new page */
  }

  changeCountPerPage(itemsPerPage: number) {    /* callback method to set count entities per page when dropdown item had been selected */
    this.countPerPage = itemsPerPage;
    this.getStudents();
  }

  addDialog() {
    const add = this.dialog.open(AddStudentComponent, {
      width: '50%'
    });
  }

  editDialog() {
    // this.studentUser_id.setValue(this.studentForEdit['user_id']);
    const edit = this.dialog.open(EditStudentComponent, {
      width: '50%'
    });
  }

  deleteDialog() {
    const del = this.dialog.open(DeleteStudentComponent, {
      width: '40%'
    });
  }
}
// getStudentsOnPage() {
//   this.studentsService.getPaginated(this.page, this.offset)
//     .subscribe((data) => {
//       this.studentsOnPage = data;
//     });
// }


