import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddnameComponent } from './form-addname.component';

describe('FormAddnameComponent', () => {
  let component: FormAddnameComponent;
  let fixture: ComponentFixture<FormAddnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
