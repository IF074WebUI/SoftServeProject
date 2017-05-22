import { TestBed, inject } from '@angular/core/testing';

import { GetRecordsByIdService } from './get-records-by-id.service';

describe('GetRecordsByIdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetRecordsByIdService]
    });
  });

  it('should ...', inject([GetRecordsByIdService], (service: GetRecordsByIdService) => {
    expect(service).toBeTruthy();
  }));
});
