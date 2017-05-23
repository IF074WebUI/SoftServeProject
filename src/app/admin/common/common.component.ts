import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dtester-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent<T> implements OnInit {

  @Input() itemsPerPage: number = 5;
  @Input() page: number = 1;
  @Input() entities: T[] = [];
  @Input() headers: string[] = [];
  @Output() deleteEntity: EventEmitter<T> = new EventEmitter();
  @Output() editEntity: EventEmitter<T> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getProperties(entity: T): string[] {
    return Object.getOwnPropertyNames(entity).slice(1);
  }

  edit(entity: T) {
    this.editEntity.emit(entity);
  }

  delete(entity: T) {
    this.deleteEntity.emit(entity);
  }
}
