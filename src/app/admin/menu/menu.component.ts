import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../login/login.service";
import {Router} from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
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
