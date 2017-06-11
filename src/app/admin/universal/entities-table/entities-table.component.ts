import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';

@Component({
  selector: 'dtester-entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.css']
})
export class EntitiesTableComponent<T> implements OnInit, OnChanges {

  NO_ENTITIES: string = 'Сутності відсутні';

  @Input() itemsPerPage: number = 5;
  @Input() page: number = 1;
  @Input() entities: T[] = [];
  @Input() displayPropertiesOrder: string[] = [];
  @Input() ignoreProperties: string[] = [];
  @Input() sortProperties: string[] = [];
  @Input() headers: string[] = [];
  @Input() canEdit: boolean = true;
  @Input() canDelete: boolean = true;
  @Input() canAction: boolean = false;
  @Input() btnClass: string = 'fa fa-compass';
  @Output() deleteEntity: EventEmitter<T> = new EventEmitter();
  @Output() editEntity: EventEmitter<T> = new EventEmitter();
  @Output() clickEntity: EventEmitter<T> = new EventEmitter();
  @Output() actionEntity: EventEmitter<T> = new EventEmitter();
  sortIndexes: number[] = [];
  order: string[] = [];

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    if (this.entities) {
      this.sortIndexes = this.getSortPropertiesIndexes(this.displayPropertiesOrder, this.sortProperties);
      this.order = new Array(this.displayPropertiesOrder.length);
    }
  }

  getProperties(entity: T): string[] {
    if (this.displayPropertiesOrder.length !== 0) {
      return this.displayPropertiesOrder;
    } else {
      return Object.getOwnPropertyNames(entity);
    }
  }

  actionEntityCallback(entity: T) {
    this.actionEntity.emit(entity);
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

  getSortPropertiesIndexes(displayPropertiesOrder: string[], sortProperties: string[]): number[] {
    let indexes: number[] = [];
    for (let property of sortProperties) {
      if (displayPropertiesOrder.includes(property)) {
        indexes.push(displayPropertiesOrder.indexOf(property));
      }
    }
    return indexes;
  }

  sortEntities(index: number, order: string) {
    let propName: string = this.getProperties(this.entities[0])[index];
    for (let i = 0; i < this.order.length; i++) {
      this.order[i] = '';
    }

    if (order === 'asc') {
      this.order[index + 1] = 'asc';
      this.entities.sort((e1: T, e2: T) => e1[propName].localeCompare(e2[propName]));
    } else {
      this.order[index + 1] = 'desc';
      this.entities.sort((e1: T, e2: T) => e2[propName].localeCompare(e1[propName]));
    }
  }
}
