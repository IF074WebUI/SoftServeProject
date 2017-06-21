import {Component, OnInit, ViewChild} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from '../services/faculty.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import {FACULTY_CONFIG} from '../universal/dynamic-form/config';
import {SpinnerService} from '../universal/spinner/spinner.service';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector: 'dtester-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css'],
  providers: [FacultyService]
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  page: number = 1; // current number of page
  count: number; // count all faculties
  countPerPage: number = 10;
  id: number;

  ignoreProperties: string[];
  //text: string;
  headers: string[];
  sortProperties: string[];
  displayPropertiesOrder: string[];


  IGNORE_PROPERTIES: string[] = ['faculty_id'];
  FACULTIES_HEADERS: string[] = ['№', 'назва факультету', 'детальніше про факультет'];
  SORT_PROPERTIES: string[] = ['faculty_name'];
  DISPLAY_PROPERTIES_ORDER: string[] = ['faculty_name', 'faculty_description'];
  CREATE_NEW_FACULTY = 'Додати новий факультет';


  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = FACULTY_CONFIG;

  constructor(private http: FacultyService, private route: ActivatedRoute,
              private router: Router, private spinner: SpinnerService, private toastr: ToastsManager) {
  }


  ngOnInit() {
    this.headers = this.FACULTIES_HEADERS;
    this.ignoreProperties = this.IGNORE_PROPERTIES;
    this.sortProperties = this.SORT_PROPERTIES;
    this.displayPropertiesOrder = this.DISPLAY_PROPERTIES_ORDER;

    this.getCount();
    this.getFaculties();
  }

  getFaculties(): void {
    this.spinner.showSpinner();
    this.http.getPaginatedPage(this.countPerPage, 0).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
        this.spinner.hideSpinner();
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  getCount() {
    this.http.countAllRecords().subscribe((resp) => {
        this.count = resp['numberOfRecords'];
      },
      error => {this.toastr.error(error);}
    );
  }

  changePage(d: number) {
    this.spinner.showSpinner();
    this.page = d;
    this.http.getPaginatedPage(this.countPerPage, (this.page - 1) * this.countPerPage).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
        this.spinner.hideSpinner();
      },
      error => {this.toastr.error(error);}
    );
  }

  uploadAllPages(page: number) {
    this.spinner.showSpinner();
    this.getCount();
    this.http.getPaginatedPage(this.countPerPage, (page - 1) * this.countPerPage).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
        this.spinner.hideSpinner();
      },
      error => {this.toastr.error(error);}
    );
  }

  changeCountPerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getFaculties();
  };

  search(text: string) {
    if (text === '') {
      this.getCount();
      this.getFaculties();
    } else {
      this.spinner.showSpinner();
      this.http.searchFaculty(text).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.faculties = [];
          this.spinner.hideSpinner();
        } else {
          this.faculties = <Faculty[]> resp;
          this.count = this.faculties.length;
          this.spinner.hideSpinner();
        }
      });
    }
  }

  getGroupsByFaculties(faculty: Faculty) {
    this.id = faculty['faculty_id'];
    this.router.navigate(['/admin/group'], {queryParams: {'facultyId': this.id}});
  }

  // Dynamic Module

// Methods for opening editing and deleting common modal window

  add() {
   // this.configs[1]['action'] = 'add';
    this.popup.sendItem(new Faculty('', '', ''), 'Faculty');
    this.popup.showModal();
  }

  edit(faculty: Faculty) {
   // this.configs[1]['action'] = 'edit';
    this.popup.sendItem(faculty);
    this.popup.showModal();
  }

  delete(faculty: Faculty) {
    this.popup.deleteEntity(faculty);
  }

  // Method for  add-edit, delete  submit

  formSubmitted(value) {
    if (value['faculty_id']) {
      this.http.editItem(value['faculty_id'], value['faculty_name'], value['faculty_description']).subscribe(response => {
          this.popup.cancel();
          this.uploadAllPages(this.page);
          this.toastr.success(`Факультет ${value['faculty_name']} успішно відредагований`);
        },
        error => {this.toastr.error(error);}
      );
    } else {
      this.http.addItem(value['faculty_name'], value['faculty_description']).subscribe(response => {
          this.getCount();
          (this.count % this.countPerPage === 0) ? this.page = this.page + 1 : this.page;
          this.popup.cancel();
          this.uploadAllPages(this.page);
          this.toastr.success(`Факультет ${value['faculty_name']} успішно збережений`);
        },
         error => {this.toastr.error(error);}
      );
    }
  }

  submitDelete(faculty: Faculty) {
    this.http.deleteItem(faculty['faculty_id']).subscribe(response => {
        this.getCount();
        (this.count % this.countPerPage === 1) ? this.page = this.page - 1 : this.page;
        this.uploadAllPages(this.page);
        this.toastr.success(`Факультет ${faculty['faculty_name']} успішно видалений`);
      },
      error => {this.toastr.error(error);}
    );
  }
}


