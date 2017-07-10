import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionsComponent } from './questions.component';

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;
  let debug:      DebugElement;
  let elem:      HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    debug = fixture.debugElement.query(By.css('h2'));
    elem = debug.nativeElement;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should have 5 records on page`, () => {
    component.getCountRecords();
    fixture.detectChanges();
    expect(component.getCountRecords()).toBe(5);
  });
  it(`should have a title of 'Питання'`, () => {
    component.title = 'Питання';
    fixture.detectChanges();
    expect(elem.textContent).toBe('Питання');
  });

});
