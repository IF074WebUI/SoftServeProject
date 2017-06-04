import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

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
            <h4 class="modal-title">Modal title</h4>
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
export class DynamicFormComponent implements OnInit {
  @Input()
  config: any[] = [];

  @Output()
  submitted: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.createGroup();
  }

  createGroup() {
    const group = this.fb.group({});
    this.config.forEach(control => { (control.required == true) ? group.addControl(control.name, this.fb.control('', Validators.required)) : group.addControl(control.name, this.fb.control(''))} )
      return group;
    }

    showModal()
    {
      $('#myModal').modal('show');
    }
    cancel()
    {
      $('#myModal').modal('hide');
    }

  }
