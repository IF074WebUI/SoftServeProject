import {Component, OnInit, EventEmitter, Output} from '@angular/core';
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
import {Entity} from './Entity';

declare var $: any;

@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService]
})
export class AddeditComponent<T> implements OnInit, ComponentCanDeactivate {
  @Output() addEntity: EventEmitter<T> = new EventEmitter();
  @Output() editEntity: EventEmitter<T> = new EventEmitter();

  student: Student = new Student();
  faculty: Faculty = new Faculty;
  group: Group = new Group;
  specialities: Speciality[] = [];
  faculties: Faculty[] = [];
  entity: Entity[] = [];

  HEADER: string;
  DESCRIPTION: string = 'Ввести опис';
  MODAL_TITLE: string;

// Input data
  method: string;
  entityName: string;
  entityId: number;
  Name: string;
  Description: string;
  entityService: any;
  numberOfProperties: number;

  // Output data
  id: number;
  addname: string;
  editname: string;
  editdescription: string;
  chosenfacultyId: number;
  chosenspecialityId: number;


  entityAddName: FormControl;
  entityEditDescription: FormControl;
  EntityEditForm: FormGroup;
  entityEditName: FormControl;
  chosenSpeciality: FormControl;
  chosenFaculty: FormControl;


  constructor(private facultyService: FacultyService,
              private groupService: GroupService,
              private specialityService: SpecialitiesService,
              private location: Location, private route: ActivatedRoute, private router: Router) {
    /*
     this.entityId = +this.route.snapshot.queryParams['id'];
     this.Name = this.route.snapshot.queryParams['name'];
     this.Description = this.route.snapshot.queryParams['description'];
     this.entity = this.route.snapshot.queryParams['entity'];
     */
  }

  ngOnInit() {
    this.facultyService.getAllFaculties().subscribe(resp => this.faculties = resp);
    this.groupService.getSpeciality().subscribe(resp => this.specialities = resp);

    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl('', Validators.required);
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

  showModal(method: string, entityName: string, entity: any) {
    this.numberOfProperties = 0;
    this.method = method;
    this.entityName = entityName;
    console.log(this.entityName);
    /*
     let objProp1 = Object.getOwnPropertyNames(entity1);
     let objProp2 = Object.getOwnPropertyNames(entity2);

     for (let i = 0; i < objProp1.length; i++)
     {
     entity1[objProp1[+[i]]] = entity2[objProp2[+[i]]];
     }
     */
    let objProp = Object.getOwnPropertyNames(entity);

    console.log(objProp);
    console.log(entity[objProp[+[1]]]);
    this.entityId = (entity[objProp[+[3]]]);

    if (this.method === 'add') {
      this.MODAL_TITLE = 'Створення нового' + '' + this.entityName;
      this.HEADER = 'Ввести назву';
      this.entityEditName.setValue('Hi');
    }
    if (this.method === 'edit') {
      this.MODAL_TITLE = 'Редагування' + '' + this.entityName;
      this.HEADER = 'Редагувати назву';
      this.entityAddName.setValue('Hi2');
      this.entityEditName.setValue(entity[objProp[+[1]]]);
      this.entityEditDescription.setValue(entity[objProp[+[2]]]);
    }
    if (this.method === 'delete') {
      this.MODAL_TITLE = 'Видалення ' + '' + this.entityName;
      this.HEADER = 'Ви підтверджуєте видалення?';
    }
    $('#myModal').modal('show');
  }

  confirm() {
    if (this.method === 'add') {

    }
    if (this.method === 'edit') {
      this.editEntity.emit();
    }

  }


  goBack(): void { ///not working
    this.location.back();
  }

  cancel() {
    this.EntityEditForm.reset();
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


  /*
   confirmFacultySpeciality() {
   this.entityService = this.facultyService;
   if (this.method === 'add') {
   this.entityService.addItem(this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
   }
   if (this.method === 'edit') {
   this.entityService.editItem(this.entityId, this.entityEditName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
   }
   if (this.method === 'delete') {
   this.entityService.deleteItem(this.entityId).subscribe(resp => console.log(resp));
   }
   this.EntityEditForm.reset();
   this.editEntity.emit(edit);

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
   }*/
}

