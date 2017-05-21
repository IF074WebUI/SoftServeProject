import { Component, Input} from '@angular/core';
import {Subject} from '../subject.component';
import {SubjectService} from '../subject.service';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.css']
})
export class SubjectDetailComponent {
  @Input() subject: Subject;
  constructor(
    private subjectService: SubjectService
  ) {}
  save(): void {
    this.subjectService.update(this.subject);
  }
}
