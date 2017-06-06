import {Component, OnInit, ViewChild} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import {DynamicFormComponent} from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';

@Component({
  selector: 'dtester-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css'],
  providers: [FacultyService]
})
export class FacultiesComponent<T> implements OnInit {
  faculties: Faculty[] = [];
  faculty: Faculty;
  IGNORE_PROPERTIES: string[] = ['faculty_id'];
  page: number = 1; // current number of page
  count: number; // count all faculties
  countPerPage: number = 10;
  id: number;
  ignoreProperties: string[];
  text: string;

  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;



  configs = [
    {
      type: 'id',
      text: null,
      label: 'ID факультету',
      name: 'faculty_id',
      placeholder: '',
      required: false
    },
    {
      type: 'addname',
      text: '',
      label: 'Введіть назву факультету',
      name: 'faculty_name',
      placeholder: 'Введіть назву факультету',
      required: true
    },
    {
      type: 'input',
      text: '',
      label: 'Введіть опис факультету',
      name: 'faculty_description',
      placeholder: 'Введіть опис факультету',
      required: false
    },
    // {
    //   type: 'select',
    //   value: '',
    //   label: 'Id факультету',
    //   name: 'chosefaculty',
    //   placeholder: 'ВChose факультету',
    //   required: false
    // },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];


  constructor(private http: FacultyService, private modalService: NgbModal, private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.ignoreProperties = this.IGNORE_PROPERTIES;

    this.http.countAllRecords().subscribe((resp) => {
        this.count = resp['numberOfRecords'];
      },
      error => this.router.navigate(['/bad_request'])
    );

    this.http.getPaginatedPage(this.countPerPage, 0).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  getCount() {
    this.http.countAllRecords().subscribe((resp) => {
        this.count = resp['numberOfRecords'];
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  changePage(d: number) {
    this.page = d;
    this.http.getPaginatedPage(this.countPerPage, (this.page - 1) * this.countPerPage).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  uploadAllPages(page: number) {
    this.getCount();
    this.http.getPaginatedPage(this.countPerPage, (page - 1) * this.countPerPage).subscribe((resp) => {
        this.faculties = <Faculty[]> resp;
      },
      error => this.router.navigate(['/bad_request'])
    );
  }


  search(text: string) {
    this.http.searchFaculty(text).subscribe(resp => {
      if (resp['response'] === 'no records') {
        this.faculties = [];
      }
      else {
        this.faculties = <Faculty[]> resp;
        this.count = this.faculties.length;
      }
    });
  }

  getGroupsByFaculties(faculty: Faculty) {
    this.id = faculty['faculty_id'];
    this.router.navigate(['/admin/group'], {queryParams: {'Id': this.id}});
  }



  // Dynamic Module


// Method for opening editing and deleting commo modal window

  add() {
    this.popup.sendItem(new Faculty('', '', ''));
    this.popup.showModal();
  }

 edit(faculty: Faculty){
   this.popup.sendItem(faculty);
   this.popup.showModal();
 }

  formSubmitted(value) {
    console.log(value);
    if (value['faculty_id']){ this.http.editItem(value['faculty_id'], value['faculty_name'], value['faculty_description']).subscribe(response => {
        this.uploadAllPages(this.page);
        this.popup.cancel();
      },
      error => this.router.navigate(['/bad_request'])
    );} else {
    this.http.addItem(value['faculty_name'], value['faculty_description']).subscribe(response => {
        this.getCount();
        (this.count % this.countPerPage === 0) ? this.page = this.page + 1 : this.page;
        this.uploadAllPages(this.page);
        this.popup.cancel();
      },
      error => this.router.navigate(['/bad_request'])
    );}
  }


}


