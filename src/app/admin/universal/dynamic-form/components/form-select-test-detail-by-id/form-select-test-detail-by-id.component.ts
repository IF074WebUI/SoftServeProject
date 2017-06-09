import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';
import {TestDetailService} from "../../../../test-detail/test-detail.service";

@Pipe({
  name: 'testDetail'
})
export class TestDetailPipe implements PipeTransform {


  transform(array: any, inputarray?: any): any {
    let result = array;
    for (let j in inputarray){
      for(let i in array){
      if (array[i] == inputarray[j]){result.splice(i, 1)}
    }}
    return result;
  }

}

@Component({
  selector: 'app-form-select-test-detail-by-id',
  templateUrl: './form-select-test-detail-by-id.component.html',
  styleUrls: ['./form-select-test-detail-by-id.component.css']
})
export class FormSelectTestDetailByIdComponent implements OnInit {
  config;
  group: FormGroup;
  test_id = 13;
  array: Array<number>=[];
  entities = [1,2,3,4,5,6,7,8,9,10];



  transform(array: any, inputarray?: any): any {
    let result = array;
    for (let j in inputarray){
      for(let i in array){
        if (array[i] == inputarray[j]){result.splice(i, 1)}
      }}
    return result;
  }

  constructor(private testDetailService: TestDetailService) { }

  ngOnInit() {
    this.testDetailService.getTestDetails(this.test_id).subscribe(resp => { resp.forEach(test => this.array.push(test['level']));
      this.array = this.transform(this.entities, this.array);
    });


  }


}
