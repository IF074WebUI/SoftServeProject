import {Component, OnInit, ViewChild} from '@angular/core';
import { StatisticsService } from './statistics.service';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { GroupService } from '../group/group.service';
import { SpecialitiesService } from '../services/specialities.service';
import { StudentsService } from '../students/students.service';
import { Router } from '@angular/router';
import { GraphData } from './graph-data';
import { UIChart } from 'primeng/primeng';
import { FacultyService } from '../services/faculty.service';

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
  selectedEntity: string;
  @ViewChild('chart') chart: UIChart;
  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService,
              private facultyService: FacultyService) {
    this.selectedEntity = 'default';
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
    this.resfreshData();
    this.data.labels = this.entityDataName;
    console.log(this.data.labels);
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

  resfreshData() {
    this.graphData.length = 0;
    this.data.labels.length = 0;
    this.data.datasets[0].data.length = 0;
  }
  compareDataByValue(a: any, b: any) {
       const genreA = a['value'];
       const genreB = b['value'];
       let comparison = 0;
       if (genreA > genreB) {
         comparison = 1;
       } else if (genreA < genreB) {
         comparison = -1;
       }
       return comparison;
     }
  compareDataByLabel(a: any, b: any) {
       const genreA = a.label.toUpperCase();
       const genreB = b.label.toUpperCase();
       let comparison = 0;
       if (genreA > genreB) {
         comparison = 1;
       } else if (genreA < genreB) {
         comparison = -1;
       }
       return comparison;
     }
  sortGraphData(criteria: string) {
    this.getDataForSorting()
    if (criteria === 'valueInc' || criteria === 'valueDec') {
      this.graphData.sort(this.compareDataByValue);
      this.checkAndReverseData(criteria);
      this.showDataOnGraph();
    } else {
      this.graphData.sort(this.compareDataByLabel);
      this.checkAndReverseData(criteria);
      this.showDataOnGraph();
      this.chart.reinit();
    }
  }
  getDataForSorting() {
    for (let i = 0; i < this.data.labels.length; i++) {
      this.graphData[i] = {
        label: this.data.labels[i],
        value: this.data.datasets[0].data[i]
      };
    }
  }
  showDataOnGraph() {
    for (let i = 0; i < this.graphData.length; i++) {
      this.data.labels[i] = this.graphData[i].label;
      this.data.datasets[0].data[i] = this.graphData[i].value;
    }
  }
  checkAndReverseData(criteria: string) {
   if (criteria === 'valueDec' || criteria === 'nameDec') {
     this.graphData.reverse();
   }
  }
  selectEntityForGraph() {
    switch (this.selectedEntity) {
      case 'default': this.getData(); break;
      case 'faculty': this.countDataForFaculty(); break;
      case 'speciality':  this.countDataForSpeciality(); break;
    }
  }
  countDataForFaculty() {
    this.resfreshData();
      this.spinner.showSpinner();
      this.facultyService.getAllFaculties().subscribe(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            this.graphData[i] = { label: res[i].faculty_name, value: res.length };
          };
          this.showDataOnGraph();
          this.chart.reinit();
          this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']);
        });
  }
    countDataForSpeciality() {
      this.resfreshData();
      this.spinner.showSpinner();
      this.spesialityService.getAll().subscribe(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            this.graphData[i] = { label: res[i].speciality_name, value: res.length };
          };
          this.showDataOnGraph();
          this.chart.reinit();
          this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']);
        });
  }
}


