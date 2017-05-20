import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'dtester-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {


  @Input() countRecords: number;
  @Input() recordsPerPage: number;
  @Input() currentPage: number;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  countPagesArray: number[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    let countPages = this.countRecords % this.recordsPerPage === 0 ? this.countRecords / this.recordsPerPage :
      Math.ceil(this.countRecords / this.recordsPerPage);
    this.countPagesArray.length = 0;
    for (let i = 1; i <= countPages; i++) {
      this.countPagesArray.push(i);
    }
  }

  pageChange(page: number) {
    this.pageChanged.emit(page);
  }
}
