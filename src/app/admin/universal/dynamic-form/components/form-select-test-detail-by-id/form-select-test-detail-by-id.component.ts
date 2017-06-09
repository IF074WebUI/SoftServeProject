import {FormGroup} from '@angular/forms';
import {
  AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges,
  OnInit
} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import {TestDetailService} from '../../../../test-detail/test-detail.service';

@Pipe({
  name: 'testDetail'
})
export class TestDetailPipe implements PipeTransform {


  transform(array: any, inputarray?: any): any {
    let result = array;
    for (let j in inputarray) {
      for (let i in array) {
        if (array[i] == inputarray[j]) {
          result.splice(i, 1)
        }
      }
    }
    return result;
  }

}

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

  constructor(private testDetailService: TestDetailService) {
  }

  ngOnInit() {
  }

ngAfterContentInit(){
  this.entitiesForEdit = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.entitiesForAdd = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  this.testDetailService.getTestDetails(+[this.config.test_id]).subscribe(resp => {
    resp.forEach(test => this.array.push(test['level']));
    this.entitiesForAdd = this.transform( this.entitiesForAdd, this.array);
  });


  console.log(this.entitiesForEdit);

}
  ngAfterContentChecked(){
    if (this.group.controls['test_id'].value === '') {this.entities =  this.entitiesForAdd} else {this.entities = this.entitiesForEdit}
}

  transform(array: any, inputarray?: any): any {
    let result = array;
    for (let j in inputarray) {
      for (let i in array) {
        if (array[i] == inputarray[j]) {
          result.splice(i, 1)
        }
        ;
      }
    }
    return result;
  }


}
