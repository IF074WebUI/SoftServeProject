import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { SpinnerService } from '../universal/spinner/spinner.service';
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
  data: any;
  entityNames: string[];
  entityDataName: string[];
  dataValue: number[];

  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService) {
    this.dataValue = [];
    this.entityNames = ['faculty', 'speciality', 'group', 'subject', 'test', 'student', 'question'];
    this.entityDataName = ['Факультети', 'Спеціальності', 'Групи', 'Предмети', 'Тести', 'Студенти', 'Питання'];
    this.data = {
      labels: [],
      datasets: [
        {
          label: 'system statistic',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: []
        }
      ]
    };
  }
  ngOnInit() {
    this.getData();
  };
  getData() {
    this.data.labels = this.entityDataName;
    for (let index = 0; index < this.entityNames.length; index++) {
      this.spinner.showSpinner();
      this.statistics.getCountRecords(this.entityNames[index]).subscribe(
        (res) => {
          this.dataValue[index] = +res.numberOfRecords;
          this.data.datasets[0].data[index] = this.dataValue[index];
          this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']);
        });
    }
  }
  sortGraphData(criteria: string) {
    if (criteria === 'value') {
      this.sortGraphByValue();
    } else {
      this.sortgraphByName();
    }
  }
  sortGraphByValue() {
    console.log('1234567');

  }
  sortgraphByName() {
    console.log('qwerty');
  }
}

