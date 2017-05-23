import {CanLoad, Route, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {LoginService} from "../login/login.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AdminGuard implements CanLoad {
  constructor(private router: Router, private loginService: LoginService) {
  }

  canLoad(route: Route): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged !== 'logged') {
        return false;
      } else {
        let role = resp['roles'][1];
        if (role === 'admin') {
          return true;
        } else if (role === 'students') {
          this.router.navigate((['/denied']));
        }
        return false;
      }
    });
  }
}


