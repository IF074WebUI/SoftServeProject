import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { GroupService } from '../group/group.service';
import { SpecialitiesService } from '../services/specialities.service';
import { StudentsService } from '../students/students.service';
import { Router } from '@angular/router';
import { GraphData } from './graph-data';

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
  graphData: GraphData[];
  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService) {
    this.dataValue = [];
    this.graphData = [];
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
      this.sortGraphByName();
    }
    this.getDataForSorting();
  }

  sortGraphByValue() {
    console.log('1234567');

  }

  sortGraphByName() {
    console.log('qwerty');
  }
  getDataForSorting() {
    for (let i = 0; i < this.data.labels.length; i++) {
      this.graphData[i] = {
        label: this.data.labels[i],
        value: this.data.datasets[0].data[i]
      };
    }
    console.log(this.graphData);
  }
}


