import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timeValidator } from '../time-validator';
import { TimetableService } from '../timetable.service';
import { Group } from '../../group/group';
import { Timetable } from '../timetable';

declare var $: any;

@Component({
  selector: 'app-add-update-timetable',
  templateUrl: './add-update-timetable.component.html',
  styleUrls: ['./add-update-timetable.component.css']
})
export class AddUpdateTimetableComponent implements OnInit, OnChanges {
  @Input() groups: Group[] = [];
  @Input() subjects = [];
  @Input() updatedTimetable: Timetable;
  @Input() action: string;
  timetableForm: FormGroup;
  @Output() getTimetableRecords = new EventEmitter();
  @Output() changeNumberOfRecords = new EventEmitter<string>();
  constructor(private timetableService: TimetableService) {
    this.timetableForm = new FormGroup({
      'group_id': new FormControl('', Validators.required),
      'subject_id': new FormControl('', Validators.required),
      'time_limits': new FormGroup({
        'start_date': new FormControl('', Validators.required),
        'start_time': new FormControl('', Validators.required),
        'end_date': new FormControl('', Validators.required),
        'end_time': new FormControl('', Validators.required)
      }, timeValidator)
    });
  }

  ngOnInit() {}
  ngOnChanges() {
    if (this.action === 'update') {
      this.timetableForm.setValue({
        'group_id': this.updatedTimetable.group_id,
        'subject_id': this.updatedTimetable.subject_id,
        'time_limits': {
          'start_date': this.updatedTimetable.start_date,
          'start_time': this.updatedTimetable.start_time,
          'end_date': this.updatedTimetable.end_date,
          'end_time': this.updatedTimetable.end_time
        }
      });
    } else {
      this.timetableForm.setValue({
        'group_id': '',
        'subject_id': '',
        'time_limits': {
          'start_date': '',
          'start_time': '',
          'end_date': '',
          'end_time': ''
        }
      });
    }
  }
  actionTimetable() {
    if (this.action === 'update') {
      this.updateTimeTable();
    } else {
      this.createTimeTable();
    }
  }
  createTimeTable() {
    this.timetableService.createTimeTable(this.timetableForm.value)
      .subscribe(() => {
        this.changeNumberOfRecords.emit('addingRecord');
        $('#add-update-timetable').modal('hide');
      });
  }
  updateTimeTable() {
    this.timetableService.updateTimeTable(this.timetableForm.value, this.updatedTimetable.timetable_id)
      .subscribe(() => {
        this.getTimetableRecords.emit();
        $('#add-update-timetable').modal('hide');
      });
  }
}
