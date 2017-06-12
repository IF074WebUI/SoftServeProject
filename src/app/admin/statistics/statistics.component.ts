import { Component, OnInit } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { Statistic } from './statistic';
import {SpinnerService} from '../universal/spinner/spinner.service';
import { GroupService } from '../group/group.service';
import { SpecialitiesService } from '../services/specialities.service';
import { StudentsService } from '../students/students.service';
@Component({
  selector: 'dtester-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  entity: Statistic[];
  activeTab: number = 0;
  data: any;
  countStudentsByGroup: number;
  countGroupsBySpecialyty: any;
  specialitiesId: any;
  groupsId: any;
  students: any;

  constructor(private statistics: StatisticsService,
              private spinner: SpinnerService,
              private groupService: GroupService,
              private spesialityService: SpecialitiesService,
              private studentsService: StudentsService) {
    this.students = [];
    this.countGroupsBySpecialyty = 0;
    this.specialitiesId = [];
    this.groupsId = [];
    this.entity = [
      {name: 'speciality', descriptiion: 'Спеціальність', count: ''},
      {name: 'group', descriptiion: 'Групи', count: ''},
      {name: 'subject', descriptiion: 'Предмети', count: ''},
      {name: 'test', descriptiion: 'Тести', count: ''},
      {name: 'student', descriptiion: 'Студенти', count: ''},
      {name: 'question', descriptiion: 'Питання', count: ''}];
    this.data = {
      labels: [],
      datasets: [
        {
          label: '',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: []
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
        i++;
        this.spinner.hideSpinner();
      });
    }
  }

  setActiveTab(i: number) {
    this.activeTab = i;
  }

  showGraph(entityName: string, descriptionEntity: string) {
    console.log(entityName);
    switch (entityName) {
      case 'speciality':
        this.writeSpecialityGraph(descriptionEntity);
    }
  }

  writeSpecialityGraph(descriptionEntity: string) {
    this.data.datasets.label = descriptionEntity;
    this.getSpecialities();
    for (let i of this.specialitiesId){
      this.getGroupsbySpeciality(i);
    }
  }
  getStudentsByGroupId(groupId: number) {
    this.studentsService.getStudentsByGroupId(groupId).subscribe(
      resp => {
        if (resp['response'] === 'no records') {
        } else {
          this.countStudentsByGroup = resp.length;
        }
      });
  }
  getGroupsbySpeciality(specialityId) {
    this.groupService.getGroupsBySpeciality(specialityId).subscribe(
        resp => {
          for (let i of resp) {
            if (i['response'] === 'no records') {
            } else {
              this.groupsId.push(i.group_id);
            }
          }
        });
  }
  getSpecialities() {
    this.spesialityService.getAll().subscribe(
      resp => {
        for (let i of resp){
          this.data.labels.push(i.speciality_name);
          this.specialitiesId.push(i.speciality_id);
        }
      }
    );
  }

}
