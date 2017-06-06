import {
  Component, Input, OnInit, Output, EventEmitter, ViewChild, DoCheck, AfterContentInit,
  AfterViewChecked, AfterViewInit, OnChanges
} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from '../../../../faculties/faculty.service';

declare var $: any;
@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, DoCheck, AfterViewInit, AfterViewChecked, OnChanges {
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


  constructor(private fb: FormBuilder, private facultyService: FacultyService) {
  }

  ngOnInit() {
    this.form = this.createGroup();


  }

  ngAfterViewInit() {
    // this.uniqname();
  }

  ngAfterViewChecked() {
  }

  ngDoCheck() {

  }

  ngOnChanges() {

  }


  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
      (control.required === true) ? group.addControl(control.name, this.fb.control('', [Validators.required])) : group.addControl(control.name, this.fb.control(''));
    });


    return group;

  }

  showModal() {
    $('#myModal').modal('show');
  }

  cancel() {
    $('#myModal').modal('hide');
    this.form.reset();
  }

  sendItem(entity: any) {

    this.entity = entity;
    let InputEntityNames = Object.getOwnPropertyNames(entity);
    console.log(this.entity);

    let FormNames = Object.getOwnPropertyNames(this.form.controls);
    for (let i = 0; i < InputEntityNames.length; i++) {
      this.form.controls[FormNames[+[i]]].setValue(this.entity[InputEntityNames[+[i]]]);
    }


  }

  Delete(entity: any) {
    this.entity = entity;

    // this.Properties = Object.getOwnPropertyNames(this.entity);
    // console.log(this.Properties);
    $('#delModal').modal('show');

  }
  submitDelete() {
    console.log(this.entity);
    this.deleteEntity.emit(this.entity);
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
