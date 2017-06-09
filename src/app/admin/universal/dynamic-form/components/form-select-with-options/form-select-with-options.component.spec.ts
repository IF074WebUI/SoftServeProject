import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelectWithOptionsComponent } from './form-select-with-options.component';

describe('FormSelectWithOptionsComponent', () => {
  let component: FormSelectWithOptionsComponent;
  let fixture: ComponentFixture<FormSelectWithOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSelectWithOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSelectWithOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
