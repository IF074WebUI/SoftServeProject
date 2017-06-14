import {TestBed, inject, fakeAsync} from '@angular/core/testing';

import { FacultyService } from './faculty.service';
import {BaseRequestOptions, Http, Jsonp, JsonpModule, ResponseOptions} from "@angular/http";
import {MockBackend} from "@angular/http/testing";


class MockAuthService {
  authenticated = false;

  isAuthenticated() {
    return this.authenticated;
  }
}


describe('Service: Search', () => {
  let service: FacultyService;
  let backend: MockBackend;
  //
  // beforeEach(() => {
  //   TestBed.configureTestingModule({
  //     imports: [JsonpModule],
  //     providers: [
  //       FacultyService,
  //       MockBackend,
  //       BaseRequestOptions,
  //       {
  //         provide: Jsonp,
  //         useFactory: (backend, options) => new Jsonp(backend, options),
  //         deps: [MockBackend, BaseRequestOptions]
  //       },
  //       {
  //         provide: Http,
  //         useFactory: (backend, options) => new Http(backend, options),
  //         deps: [MockBackend, BaseRequestOptions]
  //       }
  //     ]
  //   });
  // });
  // backend = TestBed.get(MockBackend);
  //
  // service = TestBed.get(FacultyService);
  // it('search should return SearchItems', fakeAsync(() => {
  //   let response = {
  //     "resultCount": 1,
  //     "results": [
  //       {
  //         "artistId": 78500,
  //         "artistName": "U2",
  //         "trackName": "Beautiful Day",
  //         "artworkUrl60": "image.jpg",
  //       }]
  //   };
  //
  //   // When the request subscribes for results on a connection, return a fake response
  //   backend.connections.subscribe(connection => {
  //     connection.mockRespond(new Response(<ResponseOptions>{
  //       body: JSON.stringify(response)
  //     }));
  //   });
  //
  //   // Perform a request and make sure we get the response we expect
  //   service.searchFaculty("U2");
  //   // tick();
  //
  //   expect(service['results'].length).toBe(1);
  //   expect(service['results'][0].artist).toBe("U2");
  //   expect(service['results'][0].name).toBe("Beautiful Day");
  //   expect(service['results'][0].thumbnail).toBe("image.jpg");
  //   expect(service['results'][0].artistId).toBe(78500);
  // }));

  it('true is true', () => expect(true).toBe(true));
});
  // it('should ...', inject([FacultyService], (service: FacultyService) => {
  //   expect(service).toBeTruthy();
  // }));
