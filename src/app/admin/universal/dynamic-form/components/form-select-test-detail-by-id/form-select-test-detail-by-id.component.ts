import {FormGroup} from '@angular/forms';
import {AfterContentChecked, AfterContentInit, Component, OnInit} from '@angular/core';
import {TestDetailService} from '../../../../test-detail/test-detail.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-form-select-test-detail-by-id',
  templateUrl: './form-select-test-detail-by-id.component.html',
  styleUrls: ['./form-select-test-detail-by-id.component.css']
})

export class FormSelectTestDetailByIdComponent implements OnInit, AfterContentInit, AfterContentChecked {
  config;
  group: FormGroup;
  array: Array<number> = [];
  entitiesForAdd;
  entitiesForEdit;
  entities;
  ERROR_MSG;
  error: boolean;


  constructor(private testDetailService: TestDetailService,  private router: Router) {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.entitiesForEdit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.entitiesForAdd = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.testDetailService.getTestDetails(+[this.config.test_id]).subscribe(resp => {
      resp.forEach(test => this.array.push(test['level']));
      this.entitiesForAdd = this.transform(this.entitiesForAdd, this.array);
    });
  }

  ngAfterContentChecked() {
//    console.log(this.group.controls['test_id'].value);
    if (this.group.controls['test_id'].value == '') {
      this.entities = this.entitiesForAdd;
    } else {
      this.entities = this.entitiesForEdit;
    }
  }

  transform(array: any, inputarray?: any): any {
    let result = array;
    for (let j in inputarray) {
      for (let i in array) {
        if (array[i] == inputarray[j]) {
          result.splice(i, 1);
        }
      }
    }
    return result;
  }

  onValueChanged(event) {
    let value: number = event.target.value;
    if (this.array.indexOf(value) !== -1) {
      this.group.controls[this.config.name].setErrors({'wrongValue': true});
      this.error = true;
      this.ERROR_MSG = 'Рівень' + ' ' + value + ' ' + 'даного тесту вже існує ';
    } else {
      this.error = false;
    }
  }

}
