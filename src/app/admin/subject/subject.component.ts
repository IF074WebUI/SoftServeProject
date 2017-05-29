import { Component, OnInit } from '@angular/core';
import { SubjectService } from './subject.service';


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
  subject: any;
  subjects: Subject[];
  selectedSubject: Subject;
  page: number;
  pageCount: number;
  limit = 5;

  constructor(private subjectService: SubjectService) { }
  getSubjects(): void {
    this.subjectService.getPagenationSubjects(this.page, this.limit).subscribe(data => {
      this.subjects = data;
    });
  }
  getNumberOfPages(): void {
    let recordsCount: number;
    this.subjectService.getNumberOfRecords().subscribe(data => {
      recordsCount = data['numberOfRecords'];
      this.pageCount = Math.ceil(recordsCount / this.limit);
    });
  }
  addSubject(subject_name: string, subject_description: string) {
    this.subjectService.createSubject(subject_name, subject_description)
      .subscribe();
    this.getSubjects();
  }
  deleteSubject(subject: Subject): void {
    this.subjectService
      .delete(subject.subject_id)
      .then(() => {
        this.subjects = this.subjects.filter(h => h !== subject);
        if (this.selectedSubject === subject) {
          this.selectedSubject = null;
        }
      });
  }
  ngOnInit(): void {
    this.page = 1;
    this.getSubjects();
    this.getNumberOfPages();
  }
  onSelect(subject: Subject): void {
    this.selectedSubject = subject;
  }
  onUpdate(subject: Subject): void {
    this.subjectService.update(subject);
  }
  increasePage(): void {
    if (this.page < this.pageCount) {
      this.page += 1;
      this.getSubjects();
    }
  }
  decreasePage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.getSubjects();
    }
  }
}


