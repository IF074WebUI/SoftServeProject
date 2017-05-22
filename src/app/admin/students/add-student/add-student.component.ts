import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-result-example-dialog',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent implements OnInit {

  constructor(public modal: MdDialogRef<any>) {}

  public cansel() {
    let cansel = this.modal.close();
  }
  ngOnInit() {
  }

}
