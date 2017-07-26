import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dtester-items-per-page',
  templateUrl: './items-per-page.component.html',
  styleUrls: ['./items-per-page.component.scss']
})
export class ItemsPerPageComponent implements OnInit {
  @Input() numberOfRecords: number;
  @Output() recordsPerPageChanged: EventEmitter<number> = new EventEmitter();
  numberOfRecordsOnPage = [5, 10, 20];

  constructor() { }

  ngOnInit() {

  }
  getNumberRecords(numberRecords: number) {
  this.recordsPerPageChanged.emit(numberRecords);
  }

}
