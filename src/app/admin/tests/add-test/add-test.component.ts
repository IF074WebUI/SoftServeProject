import {Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TestsService} from '../../services/tests.service';
import {Test} from '../test';

declare var $: any;

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css']
})
export class AddTestComponent implements OnInit, OnChanges {
  @Input() subjects = [];
  @Input() updatedTest: Test;
  @Output() getTests = new EventEmitter();
  testForm: FormGroup;
  constructor(private testsService: TestsService) {
    this.testForm = new FormGroup({
      'test_name': new FormControl('1', Validators.required),
      'tasks': new FormControl('1', Validators.required),
      'time_for_test': new FormControl('1', Validators.required),
      'enabled': new FormControl('1', Validators.required),
      'attempts': new FormControl('1', Validators.required),
      'subject_id': new FormControl('1', Validators.required)
    });
  }
  ngOnInit() {};
  ngOnChanges() {
    if(this.updatedTest) {
      this.testForm.setValue({
        'test_name': this.updatedTest.test_name,
        'tasks': this.updatedTest.tasks,
        'time_for_test': this.updatedTest.time_for_test,
        'enabled': this.updatedTest.enabled,
        'attempts': this.updatedTest.attempts,
        'subject_id': this.updatedTest.subject_id
      });
    }
  }
  createTest() {
    this.testsService.createTest(this.testForm.value)
      .subscribe(() => {
        this.testForm.reset();
        this.getTests.emit();
        $('#add-update-test').modal('hide');
      });
  }
  updateTest() {
    this.testsService.updateTest(this.testForm.value, this.updatedTest.test_id)
      .subscribe(() => {
      console.log(this.updatedTest);
        this.testForm.reset();
        this.getTests.emit();
        $('#add-update-test').modal('hide');
      });
  }
}
