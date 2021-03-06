import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from './subject';
import { StatisticsService } from '../statistics/statistics.service';
import { GetRecordsRangeService } from '../services/get-records-range.service';
import { GetRecordsBySearchService } from '../services/get-records-by-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { SUBJECTS_CONFIG } from '../universal/dynamic-form/config';
import { SubjectService } from './subject.service';
import { DeleteRecordByIdService } from '../services/delete-record-by-id.service';
import { ToastsManager } from 'ng2-toastr';
import {SpinnerService} from '../universal/spinner/spinner.service';

declare const $: any;

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  headers: string[];
  displayPropertiesOrder: string[];
  numberOfRecords: number;
  recordsPerPage: number;
  page: number;
  btnClass: string = 'fa fa-calendar';
  sortProperties: string[];
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = SUBJECTS_CONFIG;

  constructor(private statisticsService: StatisticsService,
              private getRecordsRangeService: GetRecordsRangeService,
              private getRecordsBySearchService: GetRecordsBySearchService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private subjectService: SubjectService,
              private deleteRecordByIdService: DeleteRecordByIdService,
              private toastsManager: ToastsManager,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.page = 1;
    this.recordsPerPage = 5;
    this.getCountRecords();
    this.getSubjectsRange();
    this.headers = ['№', 'Назва предмету', 'Опис'];
    this.displayPropertiesOrder = ['subject_name', 'subject_description'];
    this.sortProperties = ['subject_name'];
  }

  getSubjectsRange() {
    this.spinnerService.showSpinner();
    if (this.numberOfRecords <= (this.page - 1) * this.recordsPerPage) {
      --this.page;
    }
    this.getRecordsRangeService.getRecordsRange('subject', this.recordsPerPage, (this.page - 1) * this.recordsPerPage)
      .subscribe((data) => {
        this.subjects = data;
        this.spinnerService.hideSpinner();
      });
  }

  getCountRecords() {
    this.statisticsService.getCountRecords('subject').subscribe((data) => {
      this.numberOfRecords = data.numberOfRecords;
    });
  }

  changePage(page: number) {
    this.page = page;
    this.getSubjectsRange();
  }

  changeNumberOfRecordsPerPage(newNumberOfRecordsPerPage: number) {
    this.recordsPerPage = newNumberOfRecordsPerPage;
    this.getSubjectsRange();
  }

  startSearch(criteria: string) {
    if (criteria === '') {
      this.getSubjectsRange();
      this.getCountRecords();
    } else {
      this.getRecordsBySearchService.getRecordsBySearch('subject', criteria).subscribe(resp => {
          if (resp['response'] === 'no records') {
            this.subjects = [];
            this.numberOfRecords = this.subjects.length;
          } else {
            this.numberOfRecords = 0;
            this.page = 2;
            this.subjects = resp;
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }

  onTimeTableNavigate(subject: Subject) {
    this.router.navigate(['./timetable'], {
      queryParams: {
        'subject_id': subject.subject_id,
        'subject_name': subject.subject_name
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  onTestsNavigate(subject: Subject) {
    this.router.navigate(['subject/tests'], {
      queryParams: {
        'subject_id': subject.subject_id,
        'subject_name': subject.subject_name
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  add() {
    this.popup.sendItem(new Subject(), 'subject');
    this.popup.showModal();
  }

  edit(subject: Subject) {
    this.popup.sendItem(subject);
    this.popup.showModal();
  }

  del(subject: Subject) {
    this.popup.deleteEntity(subject);
  }

  formSubmitted(inputSubject) {
    if (!inputSubject.subject_id) {
      this.subjectService.createSubject(inputSubject).subscribe(() => {
        this.numberOfRecords++;
        this.getSubjectsRange();
        this.popup.cancel();
        this.toastsManager.success(`Предмет "${inputSubject.subject_name}" успішно створено.`);
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
    } else {
      this.subjectService.updateSubject(inputSubject).subscribe(() => {
        this.getSubjectsRange();
        this.popup.cancel();
        this.toastsManager.success(`Предмет "${inputSubject.subject_name}" успішно відредаговано.`);
      }, () => {
        this.toastsManager.error('Помилка. Спробуйте ще раз');
      });
    }
  }

  deleteSubject(deletedSubject) {
    this.subjectService.deleteCascade(deletedSubject.subject_id).subscribe(() => {
      this.getSubjectsRange();
      this.toastsManager.success(`Предмет "${deletedSubject.subject_name}" успішно видалено.`);
      --this.numberOfRecords;
    }, () => {
      this.toastsManager.error('Помилка. Спробуйте ще раз');
    });
  }
}
