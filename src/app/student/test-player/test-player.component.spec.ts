import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlayerComponent } from './test-player.component';

describe('TestPlayerComponent', () => {
  let component: TestPlayerComponent;
  let fixture: ComponentFixture<TestPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
