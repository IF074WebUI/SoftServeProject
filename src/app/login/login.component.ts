import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidCredentials: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }

  login(form: FormGroup) {
    this.loginService.login(form.controls['name'].value, form.controls['password'].value)
      .mergeMap(res => this.checkIfLogged()).subscribe(response => {
    }, err => {
        if (JSON.parse(err['_body'])['response'] === 'Invalid login or password') {
          this.invalidCredentials = true;
        }
      }
    );
  }

  checkIfLogged(): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged === 'logged') {
        let role = resp['roles'][1];
        if (role === 'student') {
          this.router.navigate((['/student']));
        } else if (role === 'admin') {
          this.router.navigate((['/admin']));
        }
        return true;
      }
    });
  }

  hideMessage() {
    this.invalidCredentials = false;
  }
}
