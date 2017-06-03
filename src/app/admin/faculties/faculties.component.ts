import {Component, OnInit, ViewChild} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NEWFACULTY, EDITRESULT, EDITFACULTY, DELETERESULT} from '../../constants';
import {AddeditComponent } from '../addedit/addedit.component';

import 'rxjs/add/operator/switchMap';
import {Entity} from "../addedit/Entity";
import {DynamicFormComponent} from "../universal/dynamic-form/container/dynamic-form/dynamic-form.component";

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
  facultyEditForm: FormGroup;
  facultyEditName: FormControl;
  facultyEditDescription: FormControl;
  facultyEditId: FormControl;
  facultyAddForm: FormGroup;
  facultyAddName: FormControl;
  facultyAddDescription: FormControl;
  modalHeader: string;
  countPerPage: number = 10;
  id: number;
  ignoreProperties: string[];
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;


  constructor(private http: FacultyService, private modalService: NgbModal, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.ignoreProperties = this.IGNORE_PROPERTIES;
    this.facultyEditName = new FormControl('', Validators.required);
    this.facultyEditDescription = new FormControl('');
    this.facultyEditId = new FormControl('');
    this.facultyEditForm = new FormGroup({
      'id': this.facultyEditId,
      'name': this.facultyEditName,
      'description': this.facultyEditDescription
    });

    this.facultyAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.facultyAddDescription = new FormControl('');
    this.facultyAddForm = new FormGroup({
      'name': this.facultyAddName,
      'description': this.facultyAddDescription
    });


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

  deleteFaculty(faculty: Faculty, content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmDelete(faculty);
      alert(DELETERESULT);
    }, (reason) => {
    });
  }



// Confirm methods for add, edit, delete faculty

  confirmAdd(entity: Entity) {
    console.log(entity.addname);
    console.log(entity.editname);
    console.log(entity.editdescription);
    this.http.addItem(entity.addname, entity.editdescription ).subscribe(response => {
        this.getCount();
        (this.count % 10 === 0) ? this.page = this.page + 1 : this.page;
        this.uploadAllPages(this.page);
        this.popup.cancel();
      },
      error => this.router.navigate(['/bad_request'])
    );
  }
  confirmEdit(entity: Entity) {
    console.log(entity.addname);
    console.log(entity.editname);
    console.log(entity.editdescription);
    this.http.editItem(entity.id, entity.editname, entity.editdescription ).subscribe(response => {
       this.uploadAllPages(this.page);
        this.popup.cancel();
      },
      error => this.router.navigate(['/bad_request'])
    );
  }
  confirmDelete(faculty: Faculty) {
    this.http.deleteItem(faculty['faculty_id']).subscribe((resp) => {
        this.getCount();
        (this.count % this.countPerPage === 1) ? this.page = this.page - 1 : this.page; // number of items per page is 10
        this.uploadAllPages(this.page);
        this.popup.cancel();
      },
      error => this.router.navigate(['/bad_request'])
    );
  };

// Method for opening editing and deleting commo modal window

  add() {
    this.popup.showModal();
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
        this.count = this.faculties.length;
      }
    });
  }

  getGroupsByFaculties(faculty: Faculty) {
    this.id = faculty['faculty_id'];
    this.router.navigate(['/admin/group'], {queryParams: {'Id': this.id}});
  }



  // Dynamic Module


  formSubmitted(value) {
    console.log(value);
  }

  config = [
    {
      type: 'number',
      value: null,
      label: 'ID факультету',
      name: 'id',
      placeholder: ''
    },
    {
      type: 'input',
      value: 'олена',
      label: 'Назву факультету',
      name: 'name',
      placeholder: 'Введіть назву факультету'
    },
    {
      type: 'select',
      value: '',
      label: 'Введіть назву факультету',
      name: 'addname',
      options: this.faculties,
      placeholder: 'Виберіть факультет'
    },

    {
      type: 'select',
      value: 'Pizza',
      label: 'Favourite food',
      name: 'food',
      options: ['Pizza', 'Hot Dogs', 'Knakworstje', 'Coffee'],
      placeholder: 'Select an option'
    },
    {
      label: 'Submit',
      name: 'submit',
      type: 'button'
    }
  ];
}


