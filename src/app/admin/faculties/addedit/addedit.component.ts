import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Http} from '@angular/http';
import { FacultyService } from '../faculty.service';


@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService]
})
export class AddeditComponent implements OnInit {
addName: FormControl;
addDescription: FormControl;
addForm: FormGroup;


  constructor(private http: Http) { }

  ngOnInit() {
    this.addName = new FormControl('');
    this.addDescription = new FormControl('');
    this.addForm = new FormGroup({
      'name': this.addName,
      'description': this.addDescription
    });
  }
  confirmAdd() {
    this.http.addItem(this.addName.value, this.addDescription.value).subscribe(response => {

    }
  }
}
