import { Component } from '@angular/core';
import {LoginService} from '../login/login.service';
import {Router} from '@angular/router';
@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {

  constructor(private loginService: LoginService, private router: Router) {
}

ngOnInit() {
}

  openTestPlayer(){
    this.router.navigate(['./student/test-player']);
  }
logout() {
  this.loginService.logout().subscribe(response => {
    this.router.navigate(['/login']);
  });
}
}
