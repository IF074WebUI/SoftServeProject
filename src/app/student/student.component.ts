import { Component } from '@angular/core';
import {LoginService} from '../login/login.service';
import {Router} from '@angular/router';
@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {

constructor(private loginService: LoginService, private router: Router) {
}

ngOnInit() {
}

logout() {
  this.loginService.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
