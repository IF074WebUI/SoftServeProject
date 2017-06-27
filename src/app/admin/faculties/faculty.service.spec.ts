import { TestBed, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { FacultyService } from '../services/faculty.service';
import { MockBackend, MockConnection } from '@angular/http/testing';

describe('FacultyService', () => {
  let faculties: FacultyService = null;
  let backend: MockBackend = null;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultyService]
    });
  });

  beforeEach(inject([FacultyService, MockBackend], (FacultyService: FacultyService, mockBackend: MockBackend) => {
    faculties = FacultyService;
    backend = mockBackend;
  }));

  it('should ...', inject([FacultyService], (service: FacultyService) => {
    expect(service).toBeTruthy();
  }));
});
