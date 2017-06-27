import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsComponent } from './questions.component';
import { Observable } from 'rxjs/Observable';

fdescribe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

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
  });

  // beforeEach(() => {
  //   component = new QuestionsComponent(null);
  // });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it(`should have a title of 'Питання'`, () => {
  //   component.changeNumberOfRecordsOnPage();
  //   expect(component.changeNumberOfRecordsOnPage).toBe(10);
  // });
  it(`should have a title of 'Питання'`, () => {
    expect(component.title).toContain('Питання');
  });
  // fit(`should have a title of 'Питання'`, () => {
  //   expect(component).toBeTruthy();
  // });
  // expect (questionsService.getRecordsRangeByTest)
  //
  // expect (questionsService.getQuestionById).toHaveBeenCalled();
  // expect (questionsService.getQuestions).toHaveBeenCalled();
});
