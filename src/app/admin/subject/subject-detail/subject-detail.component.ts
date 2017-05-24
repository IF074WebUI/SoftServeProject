import {Component, Input, OnInit} from '@angular/core';
import {SubjectService} from '../subject.service';
import {Subject} from '../subject.component';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent implements OnInit {

  @Input() subject: Subject;
  constructor(
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
  }

}
