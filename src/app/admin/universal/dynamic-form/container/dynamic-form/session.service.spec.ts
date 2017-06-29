import {TestBed, inject} from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  beforeEach(() => {
    // TestBed.cofigureTestingModule({
    //   providers: [SessionService]
    // });
  });

  it('should input value in ssesion object', inject([SessionService], (service: SessionService) => {
    expect(service.set('olena', 2)).toBeTruthy();
  }));

  it('should delete value in ssesion object', inject([SessionService], (service: SessionService) => {
    expect(service.remove('formValue')).toBeFalsy();
  }));

});
