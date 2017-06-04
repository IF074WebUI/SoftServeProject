import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from "../../../../faculties/faculty.service";
import {Faculty} from "../../../../faculties/Faculty";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent {
  config;
  group: FormGroup;




  constructor(private facultyService: FacultyService){
  }


  ValidatorUniqName(control: AbstractControl) {
    return this.facultyService.searchByName(control.value).map((resp: Faculty[]) => {
        for (let key of resp) {
          if (key['faculty_name'] === control.value.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    );
  }
}
