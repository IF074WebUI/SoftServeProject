import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ROLE_STUDENT, ROLE_ADMIN, LOGGED, INVALID_CREDENTIALS } from '../constants';
import 'rxjs/add/operator/mergeMap';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidCredentials: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {}

  login(form: FormGroup): void {
    this.loginService.login(form.controls['name'].value, form.controls['password'].value)
      .mergeMap(res => this.checkIfLogged()).subscribe(response => {}, err => {
        if (JSON.parse(err['_body'])['response'] === INVALID_CREDENTIALS) {
          this.invalidCredentials = true;
        }
      }
    );
  }

  checkIfLogged(): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged === LOGGED) {
        let role = resp['roles'][1];
        if (role === ROLE_STUDENT) {
          this.router.navigate((['/student']));
        } else if (role === ROLE_ADMIN) {
          this.router.navigate((['/admin']));
        }
        return true;
      } else return false;
    });
  }

  hideMessage(): void {
    this.invalidCredentials = false;
  }
}
