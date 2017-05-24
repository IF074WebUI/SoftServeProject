import { TestBed, inject } from '@angular/core/testing';

import { GetAllRecordsService } from './get-all-records.service';

describe('GetAllRecordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetAllRecordsService]
    });
  });

  it('should ...', inject([GetAllRecordsService], (service: GetAllRecordsService) => {
    expect(service).toBeTruthy();
  }));
});
