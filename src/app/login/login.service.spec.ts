import { TestBed, inject } from '@angular/core/testing';
import {
  HttpModule,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LoginService } from './login.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, FormsModule, CommonModule,
        ReactiveFormsModule],
      providers: [
        LoginService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  fdescribe('checkLogged()', () => {
    fit('should return JSON with roles if logged',
      inject([LoginService, XHRBackend], (loginService, mockBackend) => {

        const mockResponse = {response: 'logged', roles: ['login', 'admin'], username: 'admin'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        loginService.checkLogged().subscribe((resp) => {
          expect(resp.response).toEqual('logged');
          expect(resp.roles[1]).toEqual('admin');
          expect(resp.username).toEqual('admin');
        });

      }));
  });
});
