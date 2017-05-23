import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entities: string[] = ['speciality', 'group', 'subject', 'test', 'students', 'question', 'log'];
  entitiesNumber = {};


  constructor(private statistics: StatisticsService) { }

  ngOnInit() {
    for (let i = 0; i < this.entities.length; i++) {
      this.statistics.getCountRecords(this.entities[i]).subscribe((data) => {
        this.entitiesNumber[this.entities[i]] = data.numberOfRecords;
      });
    }
    console.log(this.entitiesNumber);
  }
}
