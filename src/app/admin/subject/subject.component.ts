import { Component, OnInit } from '@angular/core';
import {SubjectService} from './subject.service';

export class Subject {
  subject_id: number;
  subject_name: string;
  subject_description: string;
}

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
  providers: [SubjectService]
})
export class SubjectComponent implements OnInit {
  subjects: Subject[];
  selectedSubject: Subject;

  constructor(private subjectService: SubjectService) {
  }

  getSubjects(): void {
    this.subjectService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }
  ngOnInit(): void {
    this.getSubjects();
  }
    onSelect(subject: Subject): void {
    this.selectedSubject = subject;
  }
  addSubject(subject_name: string, subject_description: string): void {
    subject_name = subject_name.trim();
    subject_description = subject_description.trim();
    if (!subject_name || !subject_description) { return; }
    this.subjectService.create(subject_name, subject_description)
      .then(subject => {
        this.subjects.push(subject);
        this.selectedSubject = null;
      });
  }
}


