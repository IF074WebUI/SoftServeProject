import {CanLoad, Route, Router} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable()
export class AdminGuard implements CanLoad{
  constructor(private router: Router) {}

  canLoad(route: Route): boolean {
    if (localStorage.getItem('role') == 'admin') {
      console.log(localStorage.getItem('role'));
      return true;
    } else
    if (localStorage.getItem('role') == 'student') {
      this.router.navigate(['/student']);
    } else {
      this.router.navigate((['/login']));
    }
    return true;
  }
}
