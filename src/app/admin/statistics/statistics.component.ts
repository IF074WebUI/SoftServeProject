import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entities: string[] = ['user', 'speciality', 'group', 'subject', 'test', 'student', 'question', 'log'];
  entitiesNumber = {};


  constructor(private statistics: StatisticsService) { }

  ngOnInit() {
    for (let i = 0; i < this.entities.length; i++) {
      this.statistics.countFacultyRecords(this.entities[i]).subscribe((data) => {
        this.entitiesNumber[this.entities[i]] = data.numberOfRecords;
      });
    }
    console.log(this.entitiesNumber);
  }
}
