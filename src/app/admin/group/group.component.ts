import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';
import { Speciality } from '../specialities/speciality';
import { SpecialitiesService } from '../services/specialities.service';
import { FacultyService } from '../services/faculty.service';
import { Faculty } from '../faculties/Faculty';
import { ActivatedRoute, Router } from '@angular/router';
import { GROUPS_HEADERS, IGNORE_PROPERTIES } from './groupConstants';
import { SpinnerService } from '../universal/spinner/spinner.service';
import { DynamicFormComponent } from '../universal/dynamic-form/container/dynamic-form/dynamic-form.component';
import { GROUP_CONFIG } from '../universal/dynamic-form/config';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'dtester-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  providers: [FacultyService, SpecialitiesService]
})
export class GroupComponent implements OnInit {

  groupsOnPage: Group[];
  pageNumber: number;
  offset = 5;   /*number of the records for the stating page*/
  countRecords: number;
  headers: string[];            /* array of headers */
  ignoreProperties: string[];
  btnClass: string;
  CREATING_NEW_GROUP = 'Додати нову групу';
  DISPLAY_PROPERTIES_ORDER: string[] = ['group_name'];
  SORT_PROPERTIES: string[] = ['group_name'];
  displayPropertiesOrder: string[];
  sortProperties: string[];
  @ViewChild(DynamicFormComponent) popup: DynamicFormComponent;
  configs = GROUP_CONFIG;

  constructor(private getGroupsService: GroupService,
              private route: ActivatedRoute,
              private router: Router,
              private spinner: SpinnerService,
              private toastr: ToastsManager,
  ) {
    this.pageNumber = 1;
    this.btnClass = 'fa fa-calendar';
  }
  ngOnInit() {
    this.sortProperties = this.SORT_PROPERTIES;
    this.displayPropertiesOrder = this.DISPLAY_PROPERTIES_ORDER;
    this.headers = GROUPS_HEADERS;
    this.ignoreProperties = IGNORE_PROPERTIES;
    let specialityId = this.route.snapshot.queryParams['specialityId'];
    let facultyId = this.route.snapshot.queryParams['facultyId'];
    if (specialityId) {
      this.getGroupsService.getGroupsBySpeciality(specialityId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.groupsOnPage = [], error => this.router.navigate(['/bad_request']);
        } else {
          this.groupsOnPage = resp, error => this.router.navigate(['/bad_request']);
        }
      });
    } else
    if (facultyId) {
      this.getGroupsService.getGroupsByFaculty(facultyId).subscribe(resp => {
        if (resp['response'] === 'no records') {
          this.groupsOnPage = [];
        } else {
          this.groupsOnPage = resp;
        }
      });
    } else {
      this.getGroups();
    }
  }

  getGroups(): void {
    this.spinner.showSpinner();
    this.getCountRecords();
    /* if count of records less or equal than can contain current number of pages, than decrease page */
    if (this.countRecords <= (this.pageNumber - 1) * this.offset) {
      --this.pageNumber;
    }
    this.getGroupsService.getPaginatedPage(this.pageNumber, this.offset).delay(301)
      .subscribe(resp => {
        this.groupsOnPage = <Group[]>resp; this.spinner.hideSpinner(); }, err => this.toastr.error(err) );
  }

    getCountRecords() {
      this.getGroupsService.getCountGroups()
        .subscribe(resp => this.countRecords = resp );
    }

  changePage(page: number) {              /* callback method for change page pagination output event */
    this.pageNumber = page;
    this.getGroups();               /* request new groups for new page */
  }
  changeNumberOfRecordsOnPage(numberOfRecords: number) {
    this.offset = numberOfRecords;
    this.pageNumber = 1;
    this.getGroups();
  }
  // get students by group
  getStudentsByGroup(group: Group) {
    this.router.navigate(['./students'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
  }
    // search group
  startSearch(criteria: string) {   /* callback method for output in search component */
    this.spinner.showSpinner();
    if (criteria === '' || +criteria <= 0 ) {
      this.getGroups();
    } else {
      this.getGroupsService.searchByName(criteria)
        .subscribe(resp => {
          if (resp['response'] === 'no records') {    /* check condition: if no records presented for search criteria */
            this.groupsOnPage = [];
            this.countRecords = this.groupsOnPage.length;
            this.spinner.hideSpinner();
          } else {
            this.countRecords = 0;
            this.pageNumber = 2;
            this.groupsOnPage = resp;
            this.spinner.hideSpinner();
          }
        },
        err => this.router.navigate(['/bad_request']));
    }
  }
  onTimeTableNavigate(group: Group) {
    this.router.navigate(['./timetable'], {queryParams: {'group_id': group.group_id}, relativeTo: this.route.parent});
  }


// Method for opening editing and deleting commo modal window

  add() {
    this.popup.sendItem(new Group('', '', '', ''));
    this.popup.showModal();
  }

  edit(group: Group) {
    this.popup.sendItem(group);
    this.popup.showModal();
  }

  del(group: Group) {
    this.popup.deleteEntity(group);
  }
  // Method for  add/edit, delete form submiting

  formSubmitted(value) {
    if (value['group_id']) {
      this.getGroupsService.editGroup(value['group_id'], value['group_name'], value['Faculty'], value['Speciality'])
        .subscribe(response => {
          this.getGroups();
          this.popup.cancel();
            this.toastr.success(`Група ${value['group_name']} успішно відредагована`);
          },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['faculty_name']}, relativeTo: this.route.parent})
      );
    } else {
          this.getGroupsService.createCroup(value['group_name'], value['Speciality'], value['Faculty'])
            .subscribe(response => {
              this.getGroups();
              this.popup.cancel();
                this.toastr.success(`Група ${value['group_name']} успішно додана`);
              },
        error => this.router.navigate(['/bad_request'], {queryParams: {'bad_name': value['faculty_name']}, relativeTo: this.route.parent})
      );
    }
  }


  submitDelete(group: Group) {
    this.getGroupsService.deleteCascade(group['group_id']).subscribe(response => this.getGroups(),
      error => this.router.navigate(['/bad_request'])
    );
    this.toastr.success(`Група ${group['group_name']} успішно видалена`);
  }

}

