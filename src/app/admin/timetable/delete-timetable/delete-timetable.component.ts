import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Timetable} from '../timetable';
import {DeleteRecordByIdService} from '../../services/delete-record-by-id.service';
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-delete-timetable',
  templateUrl: './delete-timetable.component.html'
})
export class DeleteTimetableComponent implements OnInit {
  @Input() deletedTimetable: Timetable;
  @Output() changeNumberOfRecords = new EventEmitter<string>();

  constructor(private deleteRecordByIdService: DeleteRecordByIdService,
              private toastsManager: ToastsManager) { }

  ngOnInit() {
  }
  deleteTimetable() {
    this.deleteRecordByIdService.deleteRecordsById('timeTable', this.deletedTimetable.timetable_id)
      .subscribe(() => {
        this.changeNumberOfRecords.emit('deletingRecord');
        this.toastsManager.success('Розклад успішно видалений');
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
  }

}
