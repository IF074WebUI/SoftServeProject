import { TestBed, inject } from '@angular/core/testing';

import { SpecialitiesService } from './specialities.service';

describe('SpecialitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialitiesService]
    });
  });

  it('should ...', inject([SpecialitiesService], (service: SpecialitiesService) => {
    expect(service).toBeTruthy();
  }));
});
