import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Timetable} from '../timetable';
import {DeleteRecordByIdService} from '../../services/delete-record-by-id.service';

@Component({
  selector: 'app-delete-timetable',
  templateUrl: './delete-timetable.component.html'
})
export class DeleteTimetableComponent implements OnInit {
  @Input() deletedTimetable: Timetable;
  @Output() changeNumberOfRecords = new EventEmitter<string>();

  constructor(private deleteRecordByIdService: DeleteRecordByIdService) { }

  ngOnInit() {
  }
  deleteTimetable() {
    this.deleteRecordByIdService.deleteRecordsById('timeTable', this.deletedTimetable.timetable_id)
      .subscribe(() => {
        this.changeNumberOfRecords.emit('deletingRecord');
      });
  }

}
