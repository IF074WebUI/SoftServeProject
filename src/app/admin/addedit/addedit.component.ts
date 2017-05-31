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
import {Student} from '../students/student';
import {SpecialitiesService} from '../services/specialities.service';
import {Speciality} from '../specialities/speciality';

declare var $: any;

@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService]
})
export class AddeditComponent implements OnInit, ComponentCanDeactivate {
  student: Student = new Student();
  faculty: Faculty = new Faculty;
  group: Group = new Group;
  specialities: Speciality[] = [];
  faculties: Faculty[] = [];
  entityService: any;
  entityName: string;
  method: string;


  HEADER: string;
  DESCRIPTION: string = 'Ввести опис';
  MODAL_TITLE: string;


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


  }

  showModal(method: string, entity: any, entityName: string) {
    this.entityName = entityName;
    this.method = method;
    this.entityId = entity.id;
    this.Name = entity.name;
    this.Description = entity.description;
    if (this.method === 'add') {
      this.MODAL_TITLE = 'Створення нового' + '' + this.entityName;
      this.HEADER = 'Ввести назву';
      this.entityEditName.setValue('Hi');
    }
    if (this.method === 'edit') {
      this.MODAL_TITLE = 'Редагування' + ''  + this.entityName + this.Name;
      this.HEADER = 'Редагувати назву';
      this.entityAddName.setValue('Hi');
    }
    if (this.method === 'delete') {
      this.MODAL_TITLE = 'Видалення ' + '' + this.entityName + this.Name;
      this.HEADER = 'Ви підтверджуєте видалення?';
    }
    $('#myModal').modal('show');
  }

  confirmFacultySpeciality() {
    this.entityService = this.facultyService;
    if (this.method === 'add') {
      this.entityService.addItem(this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.method === 'edit') {
      this.entityService.editItem(this.entityId, this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.method === 'delete') {
      this.entityService.deleteItem(this.entityId).subscribe(resp => console.log(resp));
    }
    this.EntityEditForm.reset();
  };

  confirmGroup() {
    this.entityService = this.groupService;
    console.log('group works');
    if (this.method === 'add') {
      this.entityService.createCroup(this.entityAddName.value, this.chosenSpeciality.value, this.chosenFaculty.value).subscribe((resp) => console.log(resp));
    }
    if (this.method === 'edit') {
      this.entityService.editGroup(this.entityId, this.entityAddName.value, this.chosenSpeciality.value, this.chosenFaculty.value).subscribe((resp) => console.log(resp));
    }
    if (this.method === 'delete') {
      this.entityService.deleteGroup(this.entityId).subscribe(resp => console.log(resp));
    }
    this.EntityEditForm.reset();
  }

  goBack(): void { ///not working
    this.location.back();
  }

  cancel() {
    $('#myModal').modal('hide');
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

