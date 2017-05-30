import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {FacultyService} from '../faculties/faculty.service';
import {Faculty} from '../faculties/Faculty';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService]
})
export class AddeditComponent implements OnInit {
  entityId: number;
  entityAddName: FormControl;
  entityAddDescription: FormControl;
  entityEditDescription: FormControl;
  entityAddForm: FormGroup;
  EntityEditForm: FormGroup;
  entityEditName: FormControl;
  entity: Faculty = new Faculty;
  Name: string;
  Description: string;
  add: boolean;
  edit: boolean;
  HEADER: string;
  DESCRIPTION: string = 'Ввести опис';

  constructor(private facultyService: FacultyService, private location: Location, private route: ActivatedRoute, private router: Router) {
    this.entityId = +this.route.snapshot.queryParams['id'];
    this.Name = this.route.snapshot.queryParams['name'];
    this.Description = this.route.snapshot.queryParams['description'];
  }

  ngOnInit() {
    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl(this.Name, Validators.required);
    this.entityEditDescription = new FormControl(this.Description);
    this.EntityEditForm = new FormGroup({
      'addname': this.entityAddName,
      'editname': this.entityEditName,
      'editdescription': this.entityEditDescription
    });
    if (this.entityId !== 0) {
      this.entityAddName.setValue('Hi');
      this.HEADER = 'Редагувати назву'; } else {
      this.HEADER = 'Ввести назву'; }


  }


  confirmAddEdit() {

    if (this.entityId === 0) {
      this.facultyService.addItem(this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.entityId !== 0) {
      this.facultyService.editItem(this.entityId, this.entityEditName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
  }


  goBack(): void {
    this.location.back();
  }

  ValidatorUniqName(control: AbstractControl) {
    return this.facultyService.searchByName(control.value).map((resp: Faculty[]) => {
        for (let key of resp) {
          if (key['faculty_name'] === control.value.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    );
  }
}
