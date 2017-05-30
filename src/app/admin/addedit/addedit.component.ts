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
  add: boolean = false;
  edit: boolean = true;
  Name: string;
  Description: string

  constructor(private facultyService: FacultyService, private location: Location, private route: ActivatedRoute, private router: Router) {
    this.entityId = +this.route.snapshot.queryParams['id'];
    this.Name = this.route.snapshot.queryParams['name'];
    this.Description = this.route.snapshot.queryParams['description'];
  }

  ngOnInit() {

    console.log(this.Name);
    this.facultyService.getFacultyById(this.entityId).subscribe(resp => {
      this.entity = resp
    });
    console.log(this.entity);

    this.entityEditName = new FormControl('', Validators.required);
    this.entityEditDescription = new FormControl('');
    this.EntityEditForm = new FormGroup({
      'editname': this.entityEditName,
      'editdescription': this.entityEditDescription
    });

    this.entityEditName.setValue(this.Name);
    this.entityEditDescription.setValue(this.Description);
  }


  confirmAddEdit() {

    if (this.entityId === 0) {
      console.log('works')
     this.facultyService.addItem(this.entityEditName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.entityId != 0) {
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
