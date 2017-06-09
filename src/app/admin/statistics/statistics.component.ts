import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { Statistic } from './statistic';
import {SpinnerService} from '../universal/spinner/spinner.service';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entity: Statistic[];
  activeTab: number = 0;

  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService)
  {
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
      this.spinner.showSpinner()
      this.statistics.getCountRecords(entity['name']).subscribe((data) => {
        this.entity[i].count = data.numberOfRecords;
        i ++;
        this.spinner.hideSpinner();
      });
    }
  }
  setActiveTab (i: number) {
    this.activeTab = i;
  }
}
