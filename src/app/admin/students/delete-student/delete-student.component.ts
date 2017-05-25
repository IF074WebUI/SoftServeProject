import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {AddEditDeleteService} from '../add-edit-delete.service';
import {Student} from '../student';

@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css'],
  providers: [AddEditDeleteService]
})
export class DeleteStudentComponent implements OnInit {
  studentForDelete: Student;

  constructor(public modal: MdDialogRef<any>, private http: AddEditDeleteService) { }

  deleteStudent() {
    this.http.delete(this.studentForDelete['user_id']).subscribe(resp => {
      console.log(resp);
    });
  }

  public cansel() {
    let cansel = this.modal.close();
  }

  ngOnInit() {
  }

}
