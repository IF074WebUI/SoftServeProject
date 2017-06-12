import { TestBed, inject } from '@angular/core/testing';

import { AdminUserService } from './admin-user.service';

describe('AdminUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminUserService]
    });
  });

  it('should ...', inject([AdminUserService], (service: AdminUserService) => {
    expect(service).toBeTruthy();
  }));
});
