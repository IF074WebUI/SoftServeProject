import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }

  login(form: FormGroup) {
    this.loginService.login(form.controls['name'].value, form.controls['password'].value).subscribe(response => {
      if (form.controls['remember'].value) {
        localStorage.setItem('role', response['roles'][1]);
      } else {
        sessionStorage.setItem('role', response['roles'][1]);
      }
      this.checkIfLogged();
    });
  }

  checkIfLogged() {
    let role = localStorage.getItem('role') || sessionStorage.getItem('role');
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    }
    if (role === 'student') {
      this.router.navigate(['/student']);
    }
  }
}
