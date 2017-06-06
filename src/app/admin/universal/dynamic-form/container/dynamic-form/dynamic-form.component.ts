import {
  Component, Input, OnInit, Output, EventEmitter, ViewChild, DoCheck, AfterContentInit,
  AfterViewChecked, AfterViewInit, OnChanges
} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {FacultyService} from "../../../../faculties/faculty.service";
import {Faculty} from "../../../../faculties/Faculty";
import {FormAddnameComponent} from "../../components/form-addname/form-addname.component";
import {min} from "rxjs/operator/min";

declare var $: any;
@Component({
  selector: 'dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  template: `
    <div class="modal fade" tabindex="-1" role="dialog" id="myModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{MODAL_TITLE}}</h4>
          </div>
          <div class="modal-body">

            <form class="form-group"
                  class="dynamic-form"
                  [formGroup]="form"
                  (ngSubmit)="submitted.emit(form.value)">
              <ng-container
                *ngFor="let field of config;"
                dynamicField
                [config]="field"
                [group]="form">
              </ng-container>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Закрити</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

  `
})
export class DynamicFormComponent implements OnInit, DoCheck, AfterViewInit, AfterViewChecked, OnChanges {
  @Input()
  config: any[] = [];
  @Input()
  entity: any;

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();
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


// uniqname(){
//    this.form.controls['faculty_name'].valueChanges.debounceTime(700).subscribe(resp => {this.ValidatorUniqName(resp).subscribe(resp => console.log(resp))});
// }
  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => {
      (control.required == true) ? group.addControl(control.name, this.fb.control('', [Validators.required])) : group.addControl(control.name, this.fb.control(''))
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

  ValidatorUniqName(name: FormControl) {
    console.log('name');
    return this.facultyService.searchByName(name['faculty_name'].value).map((resp: Faculty[]) => {
        console.log('next step');
        for (let key of resp) {
          if (key['faculty_name'] === name['faculty_name'].value.trim()) {
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
