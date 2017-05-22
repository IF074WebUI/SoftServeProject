import { Component, OnInit } from '@angular/core';
import { TimetableService } from './timetable.service';
import { GetRecordsByIdService } from '../services/get-records-by-id.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timeTable = [];

  constructor(private timetableservice: TimetableService, recordsById: GetRecordsByIdService) { }

  ngOnInit() {
    this.timetableservice.getTimeTablesForGroup(1).subscribe((data) => {
      this.timeTable = data;
      console.log(this.timeTable);
    });
  }
}
