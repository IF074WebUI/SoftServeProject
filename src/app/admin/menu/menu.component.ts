import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../login/login.service";
import {Router} from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  group
} from '@angular/animations';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }
  logout() {
    this.loginService.logout().subscribe(response => {
      this.router.navigate(['/login']);
    });
  }
}
