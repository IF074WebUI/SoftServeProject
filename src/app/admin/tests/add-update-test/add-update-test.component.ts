import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TestsService } from '../../services/tests.service';
import { Test } from '../test';
import {ToastsManager} from "ng2-toastr";

declare var $: any;

@Component({
  selector: 'app-add-update-test',
  templateUrl: './add-update-test.component.html',
  styleUrls: ['./add-update-test.component.css']
})
export class AddUpdateTestComponent implements OnInit, OnChanges {
  @Input() subjects = [];
  @Input() updatedTest: Test;
  @Input() action: string;
  @Output() getTests = new EventEmitter();
  testForm: FormGroup;
  constructor(private testsService: TestsService,
              private toastsManager: ToastsManager) {
    this.testForm = new FormGroup({
      'test_name': new FormControl('', Validators.required),
      'tasks': new FormControl('', Validators.required),
      'time_for_test': new FormControl('', Validators.required),
      'enabled': new FormControl('', Validators.required),
      'attempts': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required)
    });
  }
  ngOnInit() {};
  ngOnChanges() {
    if (this.action === 'update') {
      this.testForm.setValue({
        'test_name': this.updatedTest.test_name,
        'tasks': this.updatedTest.tasks,
        'time_for_test': this.updatedTest.time_for_test,
        'enabled': this.updatedTest.enabled,
        'attempts': this.updatedTest.attempts,
        'subject_id': this.updatedTest.subject_id
      });
    } else {
      this.testForm.setValue({
        'test_name': '',
        'tasks': '',
        'time_for_test': '',
        'enabled': '',
        'attempts': '',
        'subject_id': ''
      });
    }
  }
  actionTest() {
    if (this.action === 'update') {
      this.updateTest();
    } else {
      this.createTest();
    }
  }
  createTest() {
    this.testsService.createTest(this.testForm.value)
      .subscribe(() => {
        this.toastsManager.success(`Тест "${this.testForm.value.test_name}" успішно створено.`);
        this.testForm.reset();
        this.getTests.emit();
        $('#add-update-test').modal('hide');
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
  }
  updateTest() {
    this.testsService.updateTest(this.testForm.value, this.updatedTest.test_id)
      .subscribe(() => {
        this.toastsManager.success(`Тест "${this.testForm.value.test_name}" успішно відредаговано.`);
        this.testForm.reset();
        this.getTests.emit();
        $('#add-update-test').modal('hide');
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
  }
}
