import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  countFacultyRecords = {};

  constructor(private statistics: StatisticsService) { }

  ngOnInit() {
    this.statistics.countFacultyRecords().subscribe((data) => {
      this.countFacultyRecords = data;
      console.log(this.countFacultyRecords);
    });
  }
}
