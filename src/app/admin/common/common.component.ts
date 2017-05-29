import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dtester-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent<T> implements OnInit {

  NO_ENTITIES: string = 'Сутності відсутні';

  @Input() itemsPerPage: number = 5;
  @Input() page: number = 1;
  @Input() entities: T[] = [];
  @Input() ignoreProperties: string[];
  @Input() headers: string[] = [];
  @Output() deleteEntity: EventEmitter<T> = new EventEmitter();
  @Output() editEntity: EventEmitter<T> = new EventEmitter();
  @Output() clickEntity: EventEmitter<T> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getProperties(entity: T): string[] {
    return Object.getOwnPropertyNames(entity);
  }

  editEntityCallback(entity: T) {
    this.editEntity.emit(entity);
  }

  deleteEntityCallback(entity: T) {
    this.deleteEntity.emit(entity);
  }

  clickEntityCallback(entity: T) {
    this.clickEntity.emit(entity);
  }
}
