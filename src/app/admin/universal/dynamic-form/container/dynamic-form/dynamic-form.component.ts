import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';

declare var $: any;
@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {
  @Input()
  config: any[] = [];
  @Input()
  entity: any;
  Properties: Array<string>;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  deleteEntity: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;


  constructor(private fb: FormBuilder, private facultyService: FacultyService, private route: ActivatedRoute,  private router: Router) {
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
      (control.required === true) ? group.addControl(control.name, this.fb.control('', [Validators.required])) : group.addControl(control.name, this.fb.control(''));
    });
    return group;
  }

// Methods for parents

  showModal() {
    $('#myModal').modal('show');
  }

  // submitDelete(entity) {
  //   console.log(this.entity);
  //   this.deleteEntity.emit(this.entity);
  // }

  sendItem(entity: any) {
    this.entity = entity;
    let InputEntityNames = Object.getOwnPropertyNames(entity);
    let FormNames = Object.getOwnPropertyNames(this.form.controls);
    for (let i = 0; i < InputEntityNames.length; i++) {
      this.form.controls[FormNames[+[i]]].setValue(this.entity[InputEntityNames[+[i]]]);
    }
  }
  entity_name: string;

  Delete(entity_name: any) {
    this.entity_name = entity_name;
    // this.Properties = Object.getOwnPropertyNames(this.entity);
    // console.log(this.Properties);
    $('#delModal').modal('show');
  }

  // Method for closing modal

  cancel() {
    $('#myModal').modal('hide');
    this.form.reset();
  }
  submitDelete(){

    this.deleteEntity.emit(this.entity_name);
}


  //
  // ValidatorUniqName(name: FormControl) {
  //   console.log('name');
  //   return this.facultyService.searchByName(name['faculty_name'].value).map((resp: Faculty[]) => {
  //       console.log('next step');
  //       for (let key of resp) {
  //         if (key['faculty_name'] === name['faculty_name'].value.trim()) {
  //           console.log('exist');
  //           return {exists: true};
  //         }
  //       }
  //       console.log('not exist');
  //
  //       return null;
  //     }
  //   );
  // }


}
