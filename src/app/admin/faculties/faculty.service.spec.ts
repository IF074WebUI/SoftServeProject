import { TestBed, inject } from '@angular/core/testing';

import { FacultyService } from './faculty.service';

describe('FacultyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultyService]
    });
  });

  it('should ...', inject([FacultyService], (service: FacultyService) => {
    expect(service).toBeTruthy();
  }));
});
