import { TestBed, inject } from '@angular/core/testing';

import { AddEditDeleteService } from './add-edit-delete.service';

describe('AddEditDeleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddEditDeleteService]
    });
  });

  it('should ...', inject([AddEditDeleteService], (service: AddEditDeleteService) => {
    expect(service).toBeTruthy();
  }));
});
