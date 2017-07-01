import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QuestionsComponent } from './questions.component';
import { Observable } from 'rxjs/Observable';

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
  fit('should create', () => {
    expect(component).toBeTruthy();
  });
  // beforeEach(() => {
  //   component = new QuestionsComponent(null);
  // });
  // it(`should have a title of 'Питання'`, () => {
  //   component.changeNumberOfRecordsOnPage();
  //   expect(component.changeNumberOfRecordsOnPage).toBe(10);
  // });
  fit(`should have a title of 'Питання'`, () => {
    component.title = 'Питання';
    fixture.detectChanges();
    expect(elem.textContent).toContain('Питання');
  });

  // fit(`should have a title of 'Питання'`, () => {
  //   expect(component).toBeTruthy();
  // });
  // expect (questionsService.getRecordsRangeByTest)
  //
  // expect (questionsService.getQuestionById).toHaveBeenCalled();
  // expect (questionsService.getQuestions).toHaveBeenCalled();
});
