import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRezultsComponent } from './test-rezults.component';

describe('TestRezultsComponent', () => {
  let component: TestRezultsComponent;
  let fixture: ComponentFixture<TestRezultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestRezultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRezultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
