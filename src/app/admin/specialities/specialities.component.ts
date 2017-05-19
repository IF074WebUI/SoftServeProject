import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "./speciality";
import {SPECIALITIES_HEADERS} from "../../constants";

declare var $: any;

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit {

  specialities: Speciality[];
  headers: string[];
  speciality: Speciality = new Speciality('', '');
  canEdit: boolean = false;
  @ViewChild('modal') modal: ElementRef;

  constructor(private specialitiesService: SpecialitiesService) {
  }

  ngOnInit() {
    this.headers = SPECIALITIES_HEADERS;
    this.getSpecialities();
  }

  getSpecialities() {
    this.specialitiesService.getAll().subscribe(resp => this.specialities = resp);
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
    this.specialitiesService.delete(speciality['speciality_id']).subscribe(resp => console.log(resp));
  }

}
