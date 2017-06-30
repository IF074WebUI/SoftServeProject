import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsMainPageComponent } from './students-main-page.component';

describe('StudentsMainPageComponent', () => {
  let component: StudentsMainPageComponent;
  let fixture: ComponentFixture<StudentsMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
