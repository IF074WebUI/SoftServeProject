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


@Component({
  selector: 'dtester-addedit',
  templateUrl: './addedit.component.html',
  styleUrls: ['./addedit.component.css'],
  providers: [FacultyService]
})
export class AddeditComponent implements OnInit, ComponentCanDeactivate {
  entityId: number;
  entityAddName: FormControl;
  entityAddDescription: FormControl;
  entityEditDescription: FormControl;
  entityAddForm: FormGroup;
  EntityEditForm: FormGroup;
  entityEditName: FormControl;
  studentSecondName: FormControl;
  studentFirstName: FormControl;
  searname: FormControl;
  password: FormControl;
  confirmpassword: FormControl;
  group: FormControl;
  entityName: string;
  entity: Faculty = new Faculty;
  groups: Group[] = [];
  Name: string;
  Description: string;
  entityService: any;
  add: boolean;
  edit: boolean;
  HEADER: string;
  DESCRIPTION: string = 'Ввести опис';

  constructor(private facultyService: FacultyService, private location: Location, private route: ActivatedRoute, private router: Router,
  private groupService: GroupService) {
    this.entityId = +this.route.snapshot.queryParams['id'];
    this.Name = this.route.snapshot.queryParams['name'];
    this.Description = this.route.snapshot.queryParams['description'];
    this.entityName = this.route.snapshot.queryParams['entity'];

  }

  ngOnInit() {
    console.log(this.entityName);
    this.entityService = this.facultyService;
    this.studentFirstName = new FormControl('');
    this.studentSecondName = new FormControl('');
    this.entityAddName = new FormControl('', Validators.required, this.ValidatorUniqName.bind(this));
    this.entityEditName = new FormControl(this.Name, Validators.required);
    this.entityEditDescription = new FormControl(this.Description);
    this.confirmpassword = new FormControl('');
    this.group = new FormControl('');
this.searname = new FormControl('');
this.password = new FormControl('');
    this.EntityEditForm = new FormGroup({
      'addname': this.entityAddName,
      'editname': this.entityEditName,
      'editdescription': this.entityEditDescription,
      'studentfirstname': this.studentFirstName,
      'studentsecondname': this.studentSecondName,
      'searname': this.searname,
      'password': this.password,
      'confirmpassword': this.confirmpassword,
      'group': this.group
    });

    if (this.entityId !== 0) {
      this.entityAddName.setValue('Hi');
      this.HEADER = 'Редагувати назву';
    } else {
      this.HEADER = 'Ввести назву';
    }

    console.log(this.getAllGroups());

  }


  confirmAddEdit() {

    if (this.entityId === 0) {
      this.entityService.addItem(this.entityAddName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
    if (this.entityId !== 0) {
      this.entityService.editItem(this.entityId, this.entityEditName.value, this.entityEditDescription.value).subscribe((resp) => console.log(resp));
    }
  }


  goBack(): void {
    this.location.back();
  }

  getAllGroups(){
    this.groupService.getGroups().subscribe(resp => this.groups = resp);
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

