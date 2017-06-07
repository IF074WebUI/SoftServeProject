import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Test } from '../test';
import {DeleteRecordByIdService} from '../../services/delete-record-by-id.service';

@Component({
  selector: 'app-delete-test',
  templateUrl: './delete-test.component.html'
})
export class DeleteTestComponent implements OnInit {
  @Input() deletedTest: Test;
  @Output() getTests = new EventEmitter();
  constructor(public deleteRecordByIdService: DeleteRecordByIdService) { }

  ngOnInit() {

  }
  deleteTest() {
    this.deleteRecordByIdService.deleteRecordsById('test', this.deletedTest.test_id)
      .subscribe(() => {
        this.getTests.emit();
      });
  }

}
