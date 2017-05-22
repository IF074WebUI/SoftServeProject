import {Component, OnInit} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';

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
  facultyForm: FormGroup;
  facultyName: FormControl;
  facultyDescription: FormControl;
  array: Array<number>;

  constructor(private http: FacultyService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.facultyName = new FormControl('', Validators.required, this.asyncValidator.bind(this));
    this.facultyDescription = new FormControl('', Validators.required);
    this.facultyForm = new FormGroup({
      'name': this.facultyName,
      'description': this.facultyDescription
    })
    this.http.getPaginatedPage(1).subscribe((resp) => {
      this.faculties = <Faculty[]> resp;
      console.log(this.faculties);
    })

    this.http.countAllRecords().subscribe((resp) => {
      this.count = resp['numberOfRecords'];
    });
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
    this.http.editItem(this.ItemforEdit['faculty_id'], this.ItemforEdit['faculty_name'], this.ItemforEdit['faculty_description']).subscribe((resp) => {
      this.uploadAllPages(this.page);
    })
  }

  confirmAdd() {
    this.http.addItem(this.facultyName.value, this.facultyDescription.value).subscribe(response => {
      this.getCount();
      (this.count % 10 === 0) ? this.page = this.page + 1 : this.page = this.page;
      this.uploadAllPages(this.page);
      this.faculty.name = "";
      this.faculty.description = "";
    })
  }

  add(content) {
 //   this.facultyName.setValue("hi");
 //   this.facultyName.setValue("hello");
    this.modalService.open(content).result.then((result) => {
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
    let n = this.ItemforEdit['faculty_name'];
    let d = this.ItemforEdit['faculty_description'];
    this.modalService.open(content).result.then((result) => {
      this.confirmEdit();
      alert('Факультет було успішно відредаговано');
    }, (reason) => {
      this.ItemforEdit['faculty_name'] = n;
      this.ItemforEdit['faculty_description'] = d;
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


}

