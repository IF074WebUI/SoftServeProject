import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable } from 'rxjs/Observable';
import { LOGGED, ROLE_ADMIN, ROLE_STUDENT } from '../constants';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.loginService.checkLogged().map(resp => {
      let logged: string = resp['response'];
      if (logged !== LOGGED) {
        return true;
      } else {
        let role = resp['roles'][1];
        if (role === ROLE_ADMIN) {
          this.router.navigate(['/admin']);
        } else if (role === ROLE_STUDENT) {
          this.router.navigate(['/students']);
        }
        return false;
      }
    });
  }
}
