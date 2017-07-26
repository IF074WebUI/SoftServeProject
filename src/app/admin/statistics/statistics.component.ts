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
import {ToastsManager} from 'ng2-toastr';
declare let $: any;

@Component({
  selector: 'dtester-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  data: any;
  entityNames: string[];
  entityDataName: string[];
  dataValue: number[];
  graphData: GraphData[];
  selectedEntity: string;
  countSudentsByGroup: number;
  @ViewChild('chart') chart: UIChart;
  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private router: Router,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService,
              private facultyService: FacultyService,
              private toastr: ToastsManager) {
    this.selectedEntity = 'default';
    this.dataValue = [];
    this.graphData = [];
    this.countSudentsByGroup = 0;
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
    this.spinner.showSpinner();
    for (let index = 0; index < this.entityNames.length; index++) {
      this.statistics.getCountRecords(this.entityNames[index]).subscribe(
        (res) => {
          this.data.labels[index] = this.entityDataName[index];
          this.data.datasets[0].data[index] = +res.numberOfRecords;
          this.chart.refresh();
        },
        error => {
          this.toastr.error(error);
        },
      );
      if (index === this.entityNames.length - 1) {
        this.spinner.hideSpinner();
      }
    }
  }

  refreshData() {
    this.graphData = [];
    this.data.labels = [];
    this.data.datasets[0].data = [];
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
    this.getDataForSorting();
    if (criteria === 'valueInc' || criteria === 'valueDec') {
      this.graphData.sort(this.compareDataByValue);
      this.checkAndReverseData(criteria);
      this.showDataOnGraph();
    } else {
      this.graphData.sort(this.compareDataByLabel);
      this.checkAndReverseData(criteria);
      this.showDataOnGraph();
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
    this.spinner.showSpinner();
    for (let i = 0; i < this.graphData.length; i++) {
      if (this.selectedEntity === 'default') {
        this.data.labels = this.entityDataName;
      } else {this.data.labels[i] = this.graphData[i].label; }
      this.data.datasets[0].data[i] = this.graphData[i].value;
    }
    this.chart.reinit();
    this.spinner.hideSpinner();
  }
  checkAndReverseData(criteria: string) {
    if (criteria === 'valueDec' || criteria === 'nameDec') {
      this.graphData.reverse();
    }
  }
  selectEntityForGraph() {
    this.refreshData();
    switch (this.selectedEntity) {
      case 'default': this.getData(); break;
      case 'faculty': this.countDataForFaculty(); break;
      case 'speciality':  this.countDataForSpeciality(); break;
    }
  }
  countDataForFaculty() {
    this.spinner.showSpinner();
    this.facultyService.getAllFaculties().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          this.graphData[i] = { label: res[i].faculty_name, value: 0 };
          this.groupService.getGroupsByFaculty(+res[i].faculty_id).subscribe(groupRes => {
            if (groupRes['response'] === 'no records') {
              this.graphData[i].value = 0;
            } else {
              for (let groupItem = 0; groupItem < groupRes.length; groupItem++) {
                this.studentsService.getStudentsByGroupId(+groupRes[groupItem].group_id).subscribe(studentRes => {
                  if (studentRes['response'] === 'no records') {
                    this.graphData[i].value += 0;
                  } else {
                    this.graphData[i].value += studentRes.length;
                  } this.showDataOnGraph();
                });
              }
            }
          });
        } this.spinner.hideSpinner(); },
      err => this.toastr.error(err)
    );
}
  countDataForSpeciality() {
    this.spinner.showSpinner();
    this.spesialityService.getAll().subscribe(
      (res) => {
        for (let i = 0; i < res.length; i++) {
          this.graphData[i] = { label: res[i].speciality_name, value: 0 };
          this.groupService.getGroupsBySpeciality(+res[i].speciality_id).subscribe(groupRes => {
            if (groupRes['response'] === 'no records') {
              this.graphData[i].value = 0;
            } else {
              for (let groupItem = 0; groupItem < groupRes.length; groupItem++) {
                this.studentsService.getStudentsByGroupId(+groupRes[groupItem].group_id).subscribe(studentRes => {
                  if (studentRes['response'] === 'no records') {
                    this.graphData[i].value += 0;
                  } else {
                    this.graphData[i].value += studentRes.length;
                  } this.showDataOnGraph();
                });
              }
            }
          });
        } },
      err => this.toastr.error(err)
    );
  }
}
