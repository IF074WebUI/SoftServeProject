import {Component} from "@angular/core";
import {LoginService} from "../login/login.service";
import {Router} from "@angular/router";
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private loginService: LoginService, private router: Router) {
  }

  logout() {
    this.loginService.logout().subscribe(response => {
      localStorage.removeItem('role');
      sessionStorage.removeItem('role');
      this.router.navigate(['/login']);
    });

  }
}
