import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dtester-items-per-page',
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.css']
})
export class ItemsPerPageComponent implements OnInit {
  NUMBER_OF_PAGE_RECORDS = [5, 10, 20];

  constructor() { }

  ngOnInit() {
  }

}
