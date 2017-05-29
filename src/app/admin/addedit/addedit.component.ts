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
  entityDescription: FormControl;
  EntityForm: FormGroup;
  entityEditName: FormControl;
  entity: Faculty = new Faculty;
  add: boolean = false;
  edit: boolean = true;

  constructor(private facultyService: FacultyService, private location: Location, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.entityId = +this.route.snapshot.queryParams['id'];
    console.log(this.entityId);
    this.facultyService.getFacultyById(this.entityId).subscribe(resp => {
    console.log(resp)
    });


    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl('', Validators.required);
    this.entityDescription = new FormControl('');
    this.EntityForm = new FormGroup({
      'addname': this.entityAddName,
      'editname': this.entityEditName,
      'description': this.entityDescription
    });
  }



  confirmAddEdit() {

    if (this.add) {
      this.facultyService.addItem(this.entityAddName.value, this.entityDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.edit) {
      this.facultyService.editItem(this.entityId, this.entityAddName.value, this.entityDescription.value).subscribe((resp) => console.log(resp));
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
