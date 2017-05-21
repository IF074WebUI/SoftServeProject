import {Component, OnInit} from '@angular/core';
import {Faculty} from './Faculty';
import {FacultyService} from './faculty.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
  closeResult: string;


  constructor(private http: FacultyService, private modalService: NgbModal) {
  }

  ngOnInit() {

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
    });
  }

  confirmAdd() {
    this.http.addItem(this.faculty.name, this.faculty.description).subscribe(response => {
      this.getCount();
      (this.count % 10 === 0) ? this.page = this.page + 1 : this.page = this.page;
      this.uploadAllPages(this.page);
      this.faculty.name = "";
      this.faculty.description = "";
    })
  }

  add(content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmAdd();
      this.closeResult = `aded`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }

  delete(content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmDelete();
      this.closeResult = `deleted`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  edit(content) {
    this.modalService.open(content).result.then((result) => {
      this.confirmEdit();
      this.closeResult = `aded`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }
}
