import { TestBed, inject } from '@angular/core/testing';

import { GroupComponent } from './group.component';

describe('GroupComponent', () => {
  let component: GroupComponent;

  beforeEach(() => {
    component = new GroupComponent;
  });

  fit('it should change page number to 1', () => {
    component.ngOnInit();
    component.changePage(1);

    expect(component.offset).toBe(1);
  });

  fit('it should change page number to 5 ', () => {
    component.ngOnInit();
    component.changePage(5);

    expect(component.offset).toBe(5);
  });
});
