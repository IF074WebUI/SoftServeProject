import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { Statistic } from './statistic';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entity: Statistic[];

  constructor(private statistics: StatisticsService) {
    this.entity = [
      {name: 'speciality', descriptiion: 'Спеціальність', count: ''},
      {name: 'group', descriptiion: 'Групи', count: ''},
      {name: 'subject', descriptiion: 'Предмети', count: ''},
      {name: 'test', descriptiion: 'Тести', count: ''},
      {name: 'student', descriptiion: 'Студенти', count: ''},
      {name: 'question', descriptiion: 'Питання', count: ''}];
  }
  ngOnInit() {
    let i: number = 0;
    for (let entity of this.entity) {
      this.statistics.getCountRecords(entity['name']).subscribe((data) => {
        console.log(entity['name'], data.numberOfRecords);
        this.entity[i].count = data.numberOfRecords;
        i ++;
      });
    }
    console.log(this.entity);
  }
}
