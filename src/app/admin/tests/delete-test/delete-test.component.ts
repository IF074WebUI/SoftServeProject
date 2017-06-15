import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Test } from '../test';
import { DeleteRecordByIdService } from '../../services/delete-record-by-id.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-delete-test',
  templateUrl: './delete-test.component.html'
})
export class DeleteTestComponent implements OnInit {
  @Input() deletedTest: Test;
  @Output() getTests = new EventEmitter();
  constructor(public deleteRecordByIdService: DeleteRecordByIdService,
              private toastsManager: ToastsManager) { }

  ngOnInit() {

  }
  deleteTest() {
    this.deleteRecordByIdService.deleteRecordsById('test', this.deletedTest.test_id)
      .subscribe(() => {
        this.getTests.emit();
        this.toastsManager.success(`Тест "${this.deletedTest.test_name}" успішно видалено.`);
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
  }

}
