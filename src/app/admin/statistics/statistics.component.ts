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
import {ToastsManager} from "ng2-toastr";

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
    this.refreshData();
    console.log(this.entityDataName);
    for (let index = 0; index < this.entityNames.length; index++) {
      this.spinner.showSpinner();
      this.statistics.getCountRecords(this.entityNames[index]).subscribe(
        (res) => {
          this.graphData[index] = {
            label: this.entityDataName[index],
            value: +res.numberOfRecords
          };
          this.spinner.hideSpinner();
          this.showDataOnGraph();
          },
            error => {
              this.toastr.error(error);
            }
      );
    }
    console.log(this.graphData);
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
    this.chart.reinit();
  }
  checkAndReverseData(criteria: string) {
    if (criteria === 'valueDec' || criteria === 'nameDec') {
     this.graphData.reverse();
   }
  }
  selectEntityForGraph() {
    this.refreshData();
    console.log(this.selectedEntity);
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
            this.graphData[i] = { label: res[i].faculty_name, value: res.length };
          };
          this.showDataOnGraph();
          this.chart.reinit();
          this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']);
        });
  }
    countDataForSpeciality() {
      this.spinner.showSpinner();
      this.spesialityService.getAll().subscribe(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            this.graphData[i] = { label: res[i].speciality_name, value: 5 };
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
                    }
                  });
                }
              }
              });
          }; this.spinner.hideSpinner(),
            err => this.router.navigate(['/bad_request']),
            console.log(this.graphData);
            this.showDataOnGraph();
            console.log(this.data);
      });
  }
}


