import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entities: string[] = ['speciality', 'group', 'subject', 'test', 'student', 'question'];
  entitiesNumber = {};


  constructor(private statistics: StatisticsService) { }

  ngOnInit() {
    for (const entity of this.entities) {
      this.statistics.getCountRecords(entity).subscribe((data) => {
        this.entitiesNumber[entity] = data.numberOfRecords;
      });
    }
  }
}
