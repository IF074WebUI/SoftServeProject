import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let role = localStorage.getItem('role') || sessionStorage.getItem('role');
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'student') {
      this.router.navigate(['/student']);
    } else {
      return true;
    }
    return false;
  }
}
