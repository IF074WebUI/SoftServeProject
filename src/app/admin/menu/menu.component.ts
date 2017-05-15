import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.loginService.logout().subscribe(response => {
      localStorage.removeItem('role');
      sessionStorage.removeItem('role');
      this.router.navigate(['/login']);
    });

  }

}
