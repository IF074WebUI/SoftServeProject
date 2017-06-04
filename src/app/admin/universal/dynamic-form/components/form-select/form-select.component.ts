import {Component, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Faculty} from "../../../../faculties/Faculty";
import {FacultyService} from "../../../../faculties/faculty.service";
@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css']
})
export class FormSelectComponent implements OnInit {
  constructor(private facultyService: FacultyService){
  }
  config;
  group: FormGroup;
  faculties: Faculty[] = [];
  ngOnInit(){
    this.facultyService.getAllFaculties().subscribe(resp => this.faculties = resp);

  }
}
