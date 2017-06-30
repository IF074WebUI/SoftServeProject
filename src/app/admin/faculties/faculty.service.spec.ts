import {TestBed, inject} from '@angular/core/testing';
import {
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  RequestMethod,
  HttpModule,
  XHRBackend
} from '@angular/http';
import {FacultyService} from '../services/faculty.service';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GroupService} from '../group/group.service';
import {StudentsService} from '../students/students.service';
import {ResultsService} from '../services/results.service';
import {adminRoutes} from '../admin.routes';
import {AdminModule} from '../admin.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DynamicFormModule} from '../universal/dynamic-form/dynamic-form.module';
import {Router, Routes, RouterModule} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';


describe('FacultyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, FormsModule, CommonModule,
        ReactiveFormsModule, RouterModule.forChild(adminRoutes), AdminModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        DynamicFormModule,
        RouterTestingModule
      ],
      providers: [
        FacultyService, GroupService, StudentsService, ResultsService,
        {provide: XHRBackend, useClass: MockBackend},
      ]
    });
  });
  describe('getFaculties()', () => {
    it('Сервіс виводить список всіх факультетів',
      inject([FacultyService, XHRBackend], (FacultyService, mockBackend) => {

        const mockResponse = {id: 2, faculty_name: 'olena', faculty_description: 'olenatest'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        FacultyService.getAllFaculties().subscribe((resp) => {
          //  expect(resp.id).toEqual('2');
          expect(resp.faculty_name).toEqual('olena');
          expect(resp.faculty_description).toEqual('olenatest');
        });

      }));
  });
  describe('deleteCascade()', () => {
    it('Видаляє факультет, навіть якщо в ньому є групи зі студентами',
      inject([FacultyService, XHRBackend], (FacultyService, mockBackend) => {

        const mockResponse = {id: 2, faculty_name: 'olena', faculty_description: 'olenatest'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        FacultyService.deleteCascade(2).subscribe((resp) => {
          //  expect(resp.id).toEqual('2');
          expect(resp).toBeFalsy();
        });

      }));
  });
});
