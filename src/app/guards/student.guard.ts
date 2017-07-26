import { CanLoad, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable } from 'rxjs/Observable';
import { LOGGED, ROLE_STUDENT, ROLE_ADMIN } from '../constants';

@Injectable()
export class StudentGuard implements CanLoad {
  constructor(private router: Router, private loginService: LoginService) {
  }

  canLoad(route: Route): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged !== LOGGED) {
        return false;
      } else {
        let role = resp['roles'][1];
        if (role === ROLE_STUDENT) {
          return true;
        } else if (role === ROLE_ADMIN) {
          this.router.navigate((['/denied']));
        }
        return false;
      }
    });
  }
}
