import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
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
        {provide: XHRBackend, useClass: MockBackend},
      ]
    });
  });

  fdescribe('checkLogged()', () => {
    fit('Якщо користувач залогінений, у відповідь повинен прийти JSON з ролями',
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
    fit('Якщо користувач не залогінений, у відповідь повинен прийти JSON "non logged"',
      inject([LoginService, XHRBackend], (loginService, mockBackend) => {

        const mockResponse = {response: 'non logged'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        loginService.checkLogged().subscribe((resp) => {
          expect(resp.response).toEqual('non logged');
        });
      }))
  });

  fdescribe('logout()', () => {
    fit('При вилогіненні, має прийти відповідь response: "user has been logout"',
      inject([LoginService, XHRBackend], (loginService, mockBackend) => {

        const mockResponse = {response: 'user has been logout'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        loginService.logout().subscribe((resp) => {
          expect(resp.response).toEqual('user has been logout');
        });
      }));
  });

  fdescribe('login(name: string, password: string)', () => {
    fit('Якщо користувач залогінився успішно, у відповідь повинен прийти JSON з ролями',
      inject([LoginService, XHRBackend], (loginService, mockBackend) => {

        const mockResponse = {response: 'ok', roles: ['login', 'admin'], username: 'admin'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        loginService.login('admin', 'dtapi_admin').subscribe((resp) => {
          expect(resp.response).toEqual('ok');
          expect(resp.roles[1]).toEqual('admin');
          expect(resp.username).toEqual('admin');
        });

      }));
    fit('Якщо користувачу не вдалося залогінитись, відповідь повинна виглядати response: "Invalid login or password"',
      inject([LoginService, XHRBackend], (loginService, mockBackend) => {

        const mockResponse = {response: 'Invalid login or password'};

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        loginService.login('admin', 'admin').subscribe((resp) => {
          expect(resp.response).toEqual('Invalid login or password');
        });
      }))
  });

});
