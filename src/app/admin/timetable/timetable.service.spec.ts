import { TestBed, inject } from '@angular/core/testing';

import { TimetableService } from './timetable.service';

describe('TimetableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimetableService]
    });
  });

  it('should ...', inject([TimetableService], (service: TimetableService) => {
    expect(service).toBeTruthy();
  }));
});
