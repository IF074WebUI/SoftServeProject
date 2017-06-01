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
  @Output() deleteEntity: EventEmitter<T> = new EventEmitter();

  student: Student = new Student();
  faculty: Faculty = new Faculty(null, '', '');
  group: Group = new Group(null, '', null, null);
  specialities: Speciality[] = [];
  faculties: Faculty[] = [];
  groups: Group[] = [];
  entity: any;
  objProp: any;

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
  // id: number;
  // addname: string;
  // editname: string;
  // editdescription: string;
  // chosenfacultyId: number;
  // chosenspecialityId: number;


  entityAddName: FormControl;
  description: FormControl;
  EntityEditForm: FormGroup;
  entityEditName: FormControl;
  chosenSpeciality: FormControl;
  chosenFaculty: FormControl;
  studentSurname: FormControl;
  studentFname: FormControl;
  chosenGroup: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
  studentName: FormControl;
  chosentestId: FormControl;
  questionText: FormControl;
  levelTINY: FormControl;
  typeTiny: FormControl;
  attachment: FormControl;
  gradeBook: FormControl;
  MODAL_CONFIRM_BODY: string = 'Ви дійсно бажаєте видалити дану сутність? ';


  constructor(private facultyService: FacultyService,
              private groupService: GroupService,
              private specialityService: SpecialitiesService,
              private location: Location, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.facultyService.getAllFaculties().subscribe(resp => this.faculties = resp);
    this.groupService.getSpeciality().subscribe(resp => this.specialities = resp);
    this.groupService.getGroups().subscribe(resp => this.groups = resp);

    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl('', Validators.required);
    this.description = new FormControl('');
    this.studentSurname = new FormControl('');
    this.studentFname = new FormControl('');
    this.chosenGroup = new FormControl('');
    this.password = new FormControl('');
    this.passwordConfirm = new FormControl('');
    this.studentName = new FormControl('');
    this.chosentestId = new FormControl('');
    this.questionText = new FormControl('');
    this.levelTINY = new FormControl('');
    this.typeTiny = new FormControl('');
    this.attachment = new FormControl('');
    this.gradeBook = new FormControl('');


    this.chosenFaculty = new FormControl('');
    this.chosenSpeciality = new FormControl('');


    this.EntityEditForm = new FormGroup({
      'addname': this.entityAddName,
      'editname': this.entityEditName,
      // student
      'grade_book': this.gradeBook,
      'student_name': this.studentName,
      'student_surname': this.studentSurname,
      'student_fname': this.studentFname,
      'password': this.password,
      'password_confirm': this.passwordConfirm,
      'chosengroupId': this.chosenGroup,
      // Group
      'chosenfacultyId': this.chosenFaculty,
      'chosenspecialityId': this.chosenSpeciality,

      // Faculty/Speciality/Subjects

      'description': this.description,

      // Questions

      'chosentestId': this.chosentestId,
      'question_text': this.questionText,
      'levelTINY': this.levelTINY,
      'typeTiny': this.typeTiny,
      'attachment': this.attachment

    });
  }

  showModal(method: string, entityName: string, inputentity: any) {

    this.method = method;
    this.entityName = entityName;
    this.entity = inputentity;


    let objInputProp = Object.getOwnPropertyNames(inputentity);
    this.Name = inputentity[objInputProp[+[1]]];

    if (this.method === 'add') {
      this.MODAL_TITLE = 'Створення нового' + '' + this.entityName;
      this.HEADER = 'Ввести назву';
      this.entityEditName.setValue('Hello');
    }
    if (this.method === 'edit') {
      this.MODAL_TITLE = 'Редагування' + '' + this.entityName;
      this.HEADER = 'Редагувати назву';
      this.entityAddName.setValue('sraka2');
      this.entityEditName.setValue(this.Name);
      this.description.setValue(this.Description);
    }
    if (this.method === 'delete') {
      this.MODAL_TITLE = 'Видалення ' + '' + this.entityName;
      this.HEADER = 'Ви підтверджуєте видалення?';
    }
    $('#myModal').modal('show');
  }

  confirm() {
    let objInputProp = Object.getOwnPropertyNames(this.entity);
    let prop = Object.getOwnPropertyNames(this.EntityEditForm.controls);

    console.log(this.method);

    if (this.entityName === 'faculty') {
      this.entity[objInputProp[+[2]]] = this.EntityEditForm.controls['description'].value;
    }
    if (this.entityName === 'student') {
      for (let i = 2; i <= 8; i++) {
        this.entity[objInputProp[+[i - 1]]] = this.EntityEditForm.controls[prop[+[i]]].value;
      }
    }
      if (this.entityName === 'group') {
        for (let i = 10; i <= 11; i++) {
          this.entity[objInputProp[+[i - 8]]] = this.EntityEditForm.controls[prop[+[i]]].value;
        }
    }

    if (this.entityName === 'questions') {
      for (let i = 1; i <= 5; i++) {
        this.entity[objInputProp[+[i]]] = this.EntityEditForm.controls[prop[+[i]]].value;
      }
    }

    if (this.method === 'add') {
      this.entity[objInputProp[+[1]]] = this.EntityEditForm.controls['addname'].value;
      console.log(this.entity);

      this.addEntity.emit(this.entity);
    }
    if (this.method === 'edit') {
      this.entity[objInputProp[+[1]]] = this.EntityEditForm.controls['editname'].value;
      this.editEntity.emit(this.entity);
    }
  }

  submitDel() {
    this.deleteEntity.emit(this.entity);
  }

  cancel() {
    this.EntityEditForm.reset();
    $('#myModal').modal('hide');
  }

  ValidatorUniqName(control: AbstractControl) {
    if (this.entityName === 'faculty') {
      this.entityService = this.facultyService;
    }
    if (this.entityName === 'speciality') {
      this.entityService = this.specialityService;
    }
    if (this.entityName === 'group') {
      this.entityService = this.groupService;
    }
    let rezult = this.entityService.searchByName(control.value).map((resp: any) => {
        for (let key of resp) {
          let Properties = Object.getOwnPropertyNames(key);
          if (key[Properties[+[1]]] === control.value.trim()) {
            return {exists: true};
          }
        }
        return null;
      }
    );
    return rezult;
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


  goBack(): void { ///not working
    this.location.back();
  }

}

