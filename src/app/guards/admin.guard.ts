import {CanLoad, Route, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class AdminGuard implements CanLoad {
  constructor(private router: Router) {
  }

  canLoad(route: Route): boolean {
    let role = localStorage.getItem('role') || sessionStorage.getItem('role');
    if (role === 'admin') {
      return true;
    } else if (role === 'student') {
      this.router.navigate(['/denied']);
    } else {
      this.router.navigate((['/login']));
    }
    return false;
  }
}
