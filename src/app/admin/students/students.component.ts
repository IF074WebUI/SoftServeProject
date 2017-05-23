import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditStudentComponent } from './edit-student/edit-student.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import {AddEditDeleteService} from './add-edit-delete.service';

@Component({
  selector: 'app-test',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  providers: [AddEditDeleteService]
})
export class StudentsComponent implements OnInit {

  constructor(private dialog: MdDialog) {}

  ngOnInit() {};

  addDialog() {
    let add = this.dialog.open(AddStudentComponent, {
      width: '50%'
    });
  }

  editDialog() {
    let edit = this.dialog.open(EditStudentComponent);
  }

  deleteDialog() {
    let del = this.dialog.open(DeleteStudentComponent, {
      width: '40%'
    });
  }
}
