import {Component, OnInit} from '@angular/core';
import { StatisticsService } from './statistics.service';
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
  data: any;
  entityNames: string[];
  entityHeaders: string[];
  entityCountValue: number[] = [];
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
    this.refreshData();
    this.data.labels = this.entityHeaders;
    let index = 0;
      for (let entity of this.entityNames) {
        this.spinner.showSpinner();
        this.statistics.getCountRecords(entity).subscribe(
          (res) => { this.entityCountValue.push(+res.numberOfRecords);
            this.data.datasets[0].data[index] = this.entityCountValue[index];
            this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']); });
        index++;
      }
  }
  refreshData() {
    this.data.datasets[0].data.length = 0;
    this.data.labels.length = 0;
    this.entityCountValue.length = 0;
  }
}
