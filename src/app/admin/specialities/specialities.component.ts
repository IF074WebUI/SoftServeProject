import {Component, OnInit} from '@angular/core';
import {SpecialitiesService} from "../services/specialities.service";
import {Speciality} from "./speciality";
import {SPECIALITIES_HEADERS} from "../../constants";

@Component({
  selector: 'dtester-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit {

  specialities: Speciality[];
  headers: string[];

  constructor(private specialitiesService: SpecialitiesService) { }

  ngOnInit() {
    this.headers = SPECIALITIES_HEADERS;
    this.specialitiesService.getAll().subscribe(resp => this.specialities = resp);
  }

  edit(speciality: Speciality) {
    this.specialitiesService.edit(speciality).subscribe(resp => console.log(resp));
  }

  delete(speciality: Speciality) {
    this.specialitiesService.delete(speciality['speciality_id']).subscribe(resp => console.log(resp));
  }

}
