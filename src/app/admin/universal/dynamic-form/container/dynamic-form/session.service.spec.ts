import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  FormGroup, FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { DynamicFormComponent } from './dynamic-form.component';
import {CommonModule} from "@angular/common";
import {HttpModule, ResponseOptions, XHRBackend} from "@angular/http";
import {SessionService} from "./session.service";
import {MockBackend} from "@angular/http/testing";


describe('FacultyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, FormsModule, CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        SessionService,
       // {provide: XHRBackend, useClass: MockBackend},
      ]
    });
  });
  // describe('getFaculties()', () => {
  //   it('Сервіс виводить список всіх факультетів',
  //     inject([SessionService, XHRBackend], (FacultyService, mockBackend) => {
  //
  //    //   const mockResponse = {id: 2, faculty_name: 'olena', faculty_description: 'olenatest'};
  //
  //       // mockBackend.connections.subscribe((connection) => {
  //       //   connection.mockRespond(new Response(new ResponseOptions({
  //       //     body: JSON.stringify(mockResponse)
  //       //   })));
  //       // });
  //
  //       SessionService.set('formValue', {olena: 29})
  //         // .subscribe((resp) => {
  //         //  expect(resp.id).toEqual('2');
  //         expect(SessionService._session).toBeTruthy();
  //      //   expect(resp.faculty_description).toEqual('olenatest');
  //       // });
  //
  // //     }));
  // });
})
