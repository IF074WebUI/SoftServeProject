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
  /*,
  animations: [
    trigger('moveLeftRight', [
      state('left', style({
        transform: 'translateX(-110%)'
      })),
      state('right', style({
        transform: 'translateX(5%)',
        background: 'purple'
      })),
      transition('left => right', [animate('0.3s')]),
      transition('right => left', [animate('0.3s')])
    ])
  ]
  */
})
export class MenuComponent implements OnInit {
  menuMove: string = 'left';

  constructor(private loginService: LoginService, private router: Router) {
  }

  ngOnInit() {
  }
  toggleMove() {
    this.menuMove = (this.menuMove === 'left') ? 'right' : 'left';
  }
  logout() {
    this.loginService.logout().subscribe(response => {
      this.router.navigate(['/login']);
    });
  }
}
