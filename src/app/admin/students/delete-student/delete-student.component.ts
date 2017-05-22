import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-student',
  templateUrl: './delete-student.component.html',
  styleUrls: ['./delete-student.component.css']
})
export class DeleteStudentComponent implements OnInit {

  constructor(public modal: MdDialogRef<any>) { }

  public cansel() {
    let cansel = this.modal.close();
  }

  ngOnInit() {
  }

}
