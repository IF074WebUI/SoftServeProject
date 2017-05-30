import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dtester-items-per-page',
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.css']
})
export class ItemsPerPageComponent implements OnInit {
  @Input() recordsPerPage: number;
  @Output() recordsPerPageChanged: EventEmitter<number> = new EventEmitter();
  NUMBER_OF_PAGE_RECORDS = [5, 10, 20];
  itemsPerPage: number;

  constructor() { }

  ngOnInit() {

  }
  getNumberRecords(numberRecords: number) {
  this.recordsPerPageChanged.emit(numberRecords);
}

}
