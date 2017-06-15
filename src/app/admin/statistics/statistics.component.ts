import { Component,  OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { Statistic } from './statistic';
import {SpinnerService} from '../universal/spinner/spinner.service';
import { GroupService } from '../group/group.service';
import { SpecialitiesService } from '../services/specialities.service';
import { StudentsService } from '../students/students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dtester-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entity: Statistic[];
  activeTab: number = 0;
  data: any;
  count: number[];
  dataValue: number[] = [];
  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService) {
    this.entity = [
      {name: 'speciality', descriptiion: 'Спеціальності', count: 0},
      {name: 'group', descriptiion: 'Групи', count: 0},
      {name: 'subject', descriptiion: 'Предмети', count: 0},
      {name: 'test', descriptiion: 'Тести', count: 0},
      {name: 'student', descriptiion: 'Студенти', count: 0},
      {name: 'question', descriptiion: 'Питання', count: 0}
      ];
    this.count = [];
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: []
        }
      ]
    };
  }

  ngOnInit() {
    console.log('check');
    this.getData();
    this.setData();
  }

  getData() {
    // for (let i = 0; i <= this.entity.length - 1; i++) {
    //   this.statistics.getCountRecords(this.entity[i]['name']).subscribe((data) => {
    //       this.count.push(data.numberOfRecords),
    //     err => this.router.navigate(['/bad_request']);
    // });
    // }
    console.log('hi');
  }
  new() {};
  setData() {
    this.refreshData();
      for (let i = 0; i <= this.entity.length - 1; i++) {
        this.data.labels.push(this.entity[i].descriptiion);
        this.data.datasets[0].data[i] = +this.count[i];
      }
  }

  refreshData() {
    this.data.labels.length = 0;
    this.data['datasets'][0].data.length = 0;
  }
}
