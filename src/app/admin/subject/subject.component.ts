import { Component, OnInit } from '@angular/core';
import { GetAllRecordsService } from '../services/get-all-records.service';
import { Subject } from './subject';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  headers: string[];
  displayPropertiesOrder: string[];
  constructor(private getAllRecordsService: GetAllRecordsService) { }

  ngOnInit() {
    this.getSubjects();
    this.headers = ['№', 'Назва предмету', 'Опис' ];
    this.displayPropertiesOrder = ['subject_name', 'subject_description'];
  }
  getSubjects() {
    this.getAllRecordsService.getAllRecords('subject').subscribe((data) => {
      this.subjects = data;
      console.log(this.subjects);
    });
  }

}
