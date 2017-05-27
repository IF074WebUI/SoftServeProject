import {Component, OnInit} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {NEWFACULTY, EDITRESULT, EDITFACULTY, DELETERESULT} from '../../constants';

import 'rxjs/add/operator/switchMap';

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
  facultyEditForm: FormGroup;
  facultyEditName: FormControl;
  facultyEditDescription: FormControl;
  facultyEditId: FormControl;
  facultyAddForm: FormGroup;
  facultyAddName: FormControl;
  facultyAddDescription: FormControl;
  modalHeader: string;
  countPerPage: number = 5;
  add: boolean = false;


  constructor(private http: FacultyService, private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
    this.facultyEditName = new FormControl('', Validators.required);
    this.facultyEditDescription = new FormControl('', Validators.required);
    this.facultyEditId = new FormControl('');
    this.facultyEditForm = new FormGroup({
      'id': this.facultyEditId,
      'name': this.facultyEditName,
      'description': this.facultyEditDescription
    });

    this.facultyAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.facultyAddDescription = new FormControl('', Validators.required);
    this.facultyAddForm = new FormGroup({
      'name': this.facultyAddName,
      'description': this.facultyAddDescription
    });


    this.http.countAllRecords().subscribe((resp) => {
        this.count = resp['numberOfRecords'];
        console.log(this.count);
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
    console.log(d);
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

  editFaculty(faculty: Faculty, content) {
    this.modalHeader = EDITFACULTY;
    this.facultyEditId.setValue(faculty['faculty_id']);
    this.facultyEditName.setValue(faculty['faculty_name']);
    this.facultyEditDescription.setValue(faculty['faculty_description']);
    this.modalService.open(content).result.then((result) => {
      this.confirmEdit();
      alert(EDITRESULT);
    }, (reason) => {
    });
  }

  confirmEdit() {
    this.http.editItem(this.facultyEditId.value, this.facultyEditName.value, this.facultyEditDescription.value).subscribe((resp) => {
        this.uploadAllPages(this.page);
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  deleteFaculty(faculty: Faculty, content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmDelete(faculty);
      alert(DELETERESULT);
    }, (reason) => {
    });
  }

  confirmDelete(faculty: Faculty) {
    this.http.deleteItem(faculty['faculty_id']).subscribe((resp) => {
        this.getCount();
        (this.count % this.countPerPage === 1) ? this.page = this.page - 1 : this.page; // number of items per page is 10
        this.uploadAllPages(this.page);
      },
      error => this.router.navigate(['/bad_request'])
    );
  };


  confirmAdd() {
    this.http.addItem(this.facultyAddName.value, this.facultyAddDescription.value).subscribe(response => {
        this.getCount();
        (this.count % 10 === 0) ? this.page = this.page + 1 : this.page;
        this.uploadAllPages(this.page);
      },
      error => this.router.navigate(['/bad_request'])
    );
  }

  addFaculty(content) {
    this.facultyAddName.reset();
    this.facultyAddDescription.reset();
    this.modalHeader = NEWFACULTY;
    this.modalService.open(content).result.then((result) => {
      this.confirmAdd();
    }, (reason) => {
    });
  }


  ValidatorUniqName(control: AbstractControl) {
    return this.http.searchByName(control.value).map((resp: Faculty[]) => {
        for (let key of resp) {
          if (key['faculty_name'] === control.value.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    );
  }

  search(text: string) {
    this.http.searchFaculty(text).subscribe(resp => {
      if (resp['response'] === 'no records') {
        this.faculties = [];
      }
      else {
        this.faculties = <Faculty[]> resp;
      }
    });
  }
}


