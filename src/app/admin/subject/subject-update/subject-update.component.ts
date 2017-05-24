import { Component, Input} from '@angular/core';
import {Subject} from '../subject.component';
import {SubjectService} from '../subject.service';

@Component({
  selector: 'app-subject-update',
  templateUrl: './subject-update.component.html',
  styleUrls: ['./subject-update.component.css']
})

export class  SubjectUpdateComponent{
  @Input() subject: Subject;
  constructor(
    private subjectService: SubjectService
  ) {}
  save(): void {
    this.subjectService.update(this.subject);
  }
}
