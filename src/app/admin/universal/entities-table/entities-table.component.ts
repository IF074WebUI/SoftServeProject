import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ORDER_ASC, ORDER_DESC } from '../../../constants';
import {Question} from '../../questions/question';

@Component({
  selector: 'dtester-entities-table',
  templateUrl: './entities-table.component.html',
  styleUrls: ['./entities-table.component.css']
})
export class EntitiesTableComponent<T> implements OnInit, OnChanges {

  @Input() itemsPerPage = 5;
  @Input() page = 1;
  NO_ENTITIES = 'Сутності відсутні';

  // @Input() itemsPerPage = 5;
  // @Input() page = 1;
  @Input() entities: T[] = [];
  @Input() displayPropertiesOrder: string[] = [];
  @Input() ignoreProperties: string[] = [];
  @Input() sortProperties: string[] = [];
  @Input() headers: string[] = [];
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() canAction = false;
  @Input() btnClass = 'fa fa-compass';
  @Input() canAct = false;
  @Input() imgAttach = 'question.attachment';
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
    const indexes: number[] = [];
    for (const property of sortProperties) {
      if (displayPropertiesOrder.includes(property)) {
        indexes.push(displayPropertiesOrder.indexOf(property));
      }
    }
    return indexes;
  }

  sortEntities(index: number, order: string) {
    console.log(index);


    const propName: string = this.getProperties(this.entities[0])[index];
    console.log(propName);
    for (let i = 0; i < this.order.length; i++) {
      this.order[i] = '';
    }

    if (order === ORDER_ASC) {
      this.order[index + 1] = ORDER_ASC;
      this.entities.sort((e1: T, e2: T) => isNaN(Number(e1[propName])) ?
        e2[propName].localeCompare(e1[propName]) : e1[propName] - e2[propName]);
    } else {
      console.log(typeof this.entities[0][propName]);
      this.order[index + 1] = ORDER_DESC;
      this.entities.sort((e1: T, e2: T) => isNaN(Number(e1[propName])) ?
        e1[propName].localeCompare(e2[propName]) : e2[propName] - e1[propName]);
    }
  }
}
