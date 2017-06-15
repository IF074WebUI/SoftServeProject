import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticGraphsComponent } from './statistic-graphs.component';

describe('StatisticGraphsComponent', () => {
  let component: StatisticGraphsComponent;
  let fixture: ComponentFixture<StatisticGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
