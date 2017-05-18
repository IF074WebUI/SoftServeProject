import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'dtester-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  @Input() entities: Object[];
  @Input() headers: string[];
  @Output() deleteEntity: EventEmitter<Object> = new EventEmitter();
  @Output() editEntity: EventEmitter<Object> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getProperties(entity: Object): string[] {
    Object.getOwnPropertyNames(entity);
    return Object.getOwnPropertyNames(entity);
  }

  edit(entity: Object) {
    this.editEntity.emit(entity);
  }

  delete(entity: Object) {
    this.deleteEntity.emit(entity);
  }
}
