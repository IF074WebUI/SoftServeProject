import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {FacultyService} from '../faculties/faculty.service';
import {Faculty} from '../faculties/Faculty';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {ComponentCanDeactivate} from '../../guards/exit.about.guard';
import {Observable} from 'rxjs/Rx';
import {GroupService} from '../group/group.service';
import {Group} from '../group/group';
import {AddEditDeleteService} from "../students/add-edit-delete.service";
import {Student} from "../students/student";
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "../specialities/speciality";


@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService, AddEditDeleteService]
})
export class AddeditComponent implements OnInit, ComponentCanDeactivate {
  student: Student = new Student();
  faculty: Faculty = new Faculty;
  group: Group = new Group;
  specialities: Speciality[] = [];
  faculties: Faculty[] = [];
  entityService: any;



  HEADER: string;
  DESCRIPTION: string = 'Ввести опис';


  entityId: number;
  entityAddName: FormControl;
  entityEditDescription: FormControl;
  EntityEditForm: FormGroup;
  entityEditName: FormControl;
  chosenSpeciality: FormControl;
  chosenFaculty: FormControl;


  entity: string;
  Name: string;
  Description: string;


  constructor(private facultyService: FacultyService,
              private groupService: GroupService,
              private specialityService: SpecialitiesService,
              private location: Location, private route: ActivatedRoute, private router: Router) {

    this.entityId = +this.route.snapshot.queryParams['id'];
    this.Name = this.route.snapshot.queryParams['name'];
    this.Description = this.route.snapshot.queryParams['description'];
    this.entity = this.route.snapshot.queryParams['entity'];

  }

  ngOnInit() {
    console.log(this.entity);
    this.facultyService.getAllFaculties().subscribe(resp => this.faculties = resp);
    this.groupService.getSpeciality().subscribe(resp => this.specialities = resp);

    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl(this.Name, Validators.required);
    this.entityEditDescription = new FormControl('');
    this.chosenFaculty = new FormControl('');
    this.chosenSpeciality = new FormControl('');


    this.EntityEditForm = new FormGroup({
      'addname': this.entityAddName,
      'editname': this.entityEditName,
      'editdescription': this.entityEditDescription,
      'chosenfacultyId': this.chosenFaculty,
      'chosenspecialityId': this.chosenSpeciality
    });

    if (this.entityId !== 0) {
      this.entityAddName.setValue('Hi');
      this.entityEditDescription.setValue(this.Description);
      this.HEADER = 'Редагувати назву';
    } else {
      this.HEADER = 'Ввести назву';
    }

  }


  confirmFacultySpeciality() {
    this.entityService = this.facultyService;
      if (this.entityId === 0) {
        this.entityService.addItem(this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
      }
      if (this.entityId !== 0) {
        this.entityService.editItem(this.entityId, this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
      }
  };

  confirmGroup() {
    this.entityService = this.groupService;
      console.log('group works');
      if (this.entityId === 0) {
        this.entityService.createCroup(this.entityAddName.value, this.chosenSpeciality.value, this.chosenFaculty.value).subscribe((resp) => console.log(resp));
      }
      if (this.entityId !== 0) {
        this.entityService.editGroup(this.entityId, this.entityAddName.value, this.chosenSpeciality.value, this.chosenFaculty.value).subscribe((resp) => console.log(resp));
      }
      this.EntityEditForm.reset();
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

  saved: boolean = false;

  save() {
    this.saved = true;
  }

  canDeactivate(): boolean | Observable<boolean> {

    if (!this.saved) {
      return confirm("Ви впевнені, що хочете перейти на сторінку?");
    }
    else {
      return true;
    }
  }
}

