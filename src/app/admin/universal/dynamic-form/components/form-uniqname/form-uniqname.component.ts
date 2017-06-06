import {Component, OnInit, Input, OnChanges, AfterViewChecked, AfterViewInit, DoCheck} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';


@Component({
  selector: 'app-form-uniqname',
  templateUrl: './form-uniqname.component.html',
  styleUrls: ['./form-uniqname.component.css']
})
export class FormAddnameComponent implements OnInit {
  config;
  group: FormGroup;

  constructor(private facultyService: FacultyService) {
  }


  ngOnInit() {
     this.group.controls['faculty_name'].valueChanges.debounceTime(700).subscribe(resp => {
        this.ValidatorUniqName(resp).subscribe(resp => console.log(resp));
      });

  }


  ValidatorUniqName(control: string) {
  //  console.log('valid works');
    return this.facultyService.searchByName(control).map((resp) => {
    //    console.log('next step');
        for (let key of resp) {
          if (key['faculty_name'] === control.trim()) {
            console.log('exist');
            return {exists: true};
          }
        }
        console.log('not exist');

        return null;
      }
    );
  }

}


