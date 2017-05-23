import {Component, OnInit, Input} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css'],
  providers: [FacultyService]
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  page: number = 1;
  count: number;
  ItemforEdit: Faculty;
  ItemforDelete: Faculty;
  faculty: Faculty = new Faculty();
  facultyEditForm: FormGroup;
  facultyEditName: FormControl;
  facultyEditDescription: FormControl;
  facultyEditId: FormControl;
  facultyAddForm: FormGroup;
  facultyAddName: FormControl;
  facultyAddDescription: FormControl;
  modalHeader: string;
  list: Array<number> = [];


  constructor(private http: FacultyService, private modalService: NgbModal,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.facultyEditName = new FormControl('', Validators.required);
    this.facultyEditDescription = new FormControl('', Validators.required);
    this.facultyEditId = new FormControl('');
    this.facultyEditForm = new FormGroup({
      'id': this.facultyEditId,
      'name': this.facultyEditName,
      'description': this.facultyEditDescription
    })

    this.facultyAddName = new FormControl('', Validators.required, this.asyncValidator.bind(this));
    this.facultyAddDescription = new FormControl('', Validators.required);
    this.facultyAddForm = new FormGroup({
      'name': this.facultyAddName,
      'description': this.facultyAddDescription
    })

    this.http.getPaginatedPage(1).subscribe((resp) => {
      this.faculties = <Faculty[]> resp;
    })

    this.http.countAllRecords().subscribe((resp) => {
      this.count = resp['numberOfRecords'];
    });

    this.route.params
      .switchMap((params: Params) => this.http.getFacultyById(+params['id']))
      .subscribe(resp => this.faculties = resp);
  }

  getCount() {
    this.http.countAllRecords().subscribe((resp) => {
      this.count = resp['numberOfRecords'];
    });
  }

  uploadAllPages(num: number) {
    this.http.getPaginatedPage(num).subscribe((resp) => {
      this.faculties = <Faculty[]> resp;
    });
  }

  changePage(d: number) {
    this.page = d;
    console.log(this.page);
    this.http.getPaginatedPage(d).subscribe((resp) => {
      this.faculties = <Faculty[]> resp;
    });
  }

  selectedItem(faculty: Faculty) {
    this.ItemforEdit = faculty;
    this.ItemforDelete = faculty;
  }

  confirmDelete() {
    this.http.deleteItem(this.ItemforDelete['faculty_id']).subscribe((resp) => {
      this.getCount();
      (this.count % 10 === 1) ? this.page = this.page - 1 : this.page = this.page;
      this.uploadAllPages(this.page);
    })
  }

  confirmEdit() {
    this.http.editItem(this.facultyEditId.value, this.facultyEditName.value, this.facultyEditDescription.value).subscribe((resp) => {
      this.uploadAllPages(this.page);
    })
  }

  confirmAdd() {
    console.log(this.facultyAddName.value);
    this.http.addItem(this.facultyAddName.value, this.facultyAddDescription.value).subscribe(response => {
      this.getCount();
      (this.count % 10 === 0) ? this.page = this.page + 1 : this.page = this.page;
      this.uploadAllPages(this.page);
    })
  }

  add(content) {
    this.modalHeader = 'Створення нового факультету';
    this.modalService.open(content).result.then((result) => {
      console.log(this.facultyAddName.value);
      this.confirmAdd();
    }, (reason) => {
      console.log(`Dismissed`);
    });
  }

  delete(content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmDelete();
      alert('Факультет було успішно видалено');
    }, (reason) => {
      console.log(`Dismissed`);
    });
  }



  edit(content) {
    this.modalHeader = 'Редагування факультету';
    this.facultyEditId.setValue(this.ItemforEdit['faculty_id']);
    this.facultyEditName.setValue(this.ItemforEdit['faculty_name']);
      this.facultyEditDescription.setValue(this.ItemforEdit['faculty_description']);
    this.modalService.open(content).result.then((result) => {
      this.confirmEdit();
      alert('Факультет було успішно відредаговано');
    }, (reason) => {
      console.log(`Dismissed`);
    });
  };


  asyncValidator(control: AbstractControl) {
    return this.http.searchByName(control.value).map((resp: Faculty[]) => {
        for (let key of resp) {
          if (key['faculty_name'] === control.value.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    )
  }

 // PaginationList(){
//    this.list.push(this.count/10 + 1);
 //   return this.list;
 // }


}

