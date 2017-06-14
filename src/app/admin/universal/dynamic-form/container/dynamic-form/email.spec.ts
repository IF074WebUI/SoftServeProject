import {
  TestBed
} from '@angular/core/testing';

import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {DynamicFormComponent} from './dynamic-form.component';
describe('Component: DynamicFormComponent', () => {
  let component: DynamicFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [ReactiveFormsModule]
    });

    const fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
  });

  it('should have a defined component', () => {
    expect(component).not.toBeDefined();
  });

  it('should create a `FormGroup` comprised of `FormControl`s', () => {
    component.ngOnInit();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it('should create a `FormControl` for each question', () => {
    component.config = [
      {
        type: 'text',
        id: 'first',
        label: 'My First',
        required: false
      },
      {
        type: 'text',
        id: 'second',
        label: 'Second!',
        required: true
      }
    ];
    component.ngOnInit();

    expect(Object.keys(component.form.controls)).toEqual([
      'first', 'second'
    ]);
  });
})
