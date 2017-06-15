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
  entityNames: string[];
  entityHeaders: string[];
  entityCountValue = [];
  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService) {
    this.entityHeaders = ['Спеціальності', 'Групи', 'Предмети', 'Тести', 'Студенти', 'Питання'];
    this.entityNames = ['speciality', 'group', 'subject', 'test', 'student', 'question'];
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
    this.getData();
  }

  getData() {
    this.data.labels = this.entityHeaders;
      for (let entity of this.entityNames) {
        this.statistics.getCountRecords(entity).subscribe(
          (res) => { this.entityCountValue.push(res.numberOfRecords);
          this.data['datasets'][0].data = this.entityCountValue; console.log(res.numberOfRecords, this.entityCountValue.length, this.data.labels);
          });
        // err => this.router.navigate(['/bad_request'])
        }
      // this.setData();
  }

  // setData() {
  //   this.refreshData();
  //   this.data.labels = this.entityHeaders;
  //   // this.data['datasets'][0].data = this.entityCountValue;
  //   for (let i = 0; i <= this.data.labels.length; i ++) {
  //     console.log(this.data.labels[i] + " sdfdsf " + this.entityCountValue);
  //   }
  // }

  refreshData() {
    this.data.labels.length = 0;
    this.data['datasets'][0].data.length = 0;
  }
}
