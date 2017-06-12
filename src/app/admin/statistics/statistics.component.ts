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
  data: any;

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

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };
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
