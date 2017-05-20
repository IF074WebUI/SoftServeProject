import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "./speciality";
import {SPECIALITIES_HEADERS} from "../../constants";
import {FormControl} from "@angular/forms";

declare var $: any;

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit {

  specialities: Speciality[];
  page: number = 1;
  count: number;
  countPerPage: number = 5;
  headers: string[];
  speciality: Speciality = new Speciality('', '');
  canEdit: boolean = false;
  @ViewChild('modal') modal: ElementRef;
  search: FormControl = new FormControl();

  constructor(private specialitiesService: SpecialitiesService) {
  }

  ngOnInit() {
    this.headers = SPECIALITIES_HEADERS;
    this.getSpecialities();
    this.getCount();
    this.search.valueChanges.debounceTime(700).mergeMap(val => this.specialitiesService.getSearched(val)).subscribe(resp => this.specialities = resp);
  }

  getSpecialities(): void {
    this.specialitiesService.getPaginated(this.countPerPage, (this.page - 1)* this.countPerPage).subscribe(resp => this.specialities = resp);
  }

  getCount(): void {
    this.specialitiesService.getCount().subscribe(resp => this.count = resp);
  }

  edit(speciality: Speciality) {
    this.canEdit = true;
    this.speciality = speciality;
    $('#myModal').modal('show');
  }

  save() {
    if (this.canEdit) {
      this.specialitiesService.edit(this.speciality).subscribe(resp => {
        console.log(resp);
        $('#myModal').modal('hide');
        this.canEdit = false;
      });
    } else {
      this.specialitiesService.save(this.speciality).subscribe(resp => {
        console.log(resp);
        this.getSpecialities();
        $('#myModal').modal('hide');
      });
    }
  }

  delete(speciality: Speciality) {
    if (confirm('Ви справді бажаєте видалити цю спеціальність?'))
      this.specialitiesService.delete(speciality['speciality_id']).subscribe(resp => {console.log(resp);
      this.getCount()});
  }

  changePage(page: number) {
    this.page = page;
    this.getSpecialities()
  }

  changePerPage(itemsPerPage: number) {
    this.countPerPage = itemsPerPage;
    this.getSpecialities();
  }
}
