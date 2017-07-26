import {Component, ElementRef, OnInit} from '@angular/core';
import { SpinnerService } from './universal/spinner/spinner.service';
import {ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  group
} from '@angular/animations';
import {LoginService} from "../login/login.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('moveLeftRight', [
      state('left', style({
        transform: 'translateX(-110%)'
      })),
      state('right', style({
        transform: 'translateX(5%)',
        background: '#826199'
      })),
      transition('left => right', [animate('0.3s')]),
      transition('right => left', [animate('0.3s')])
    ])
  ]
})
export class AdminComponent implements OnInit {
  menuMove: string = 'right';
  objLoaderStatus: boolean;

  constructor(private spinner: SpinnerService,
              private toastr: ToastsManager,
              public  vRef: ViewContainerRef,
              private loginService: LoginService,
              private router: Router,
              private elRef: ElementRef) {
    this.objLoaderStatus = false;
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });
  }
  toggleMove() {
    this.menuMove = this.menuMove === 'left' ? 'right' : 'left';
  }

  logout() {
    this.loginService.logout().subscribe(response => {
      this.router.navigate(['/login']);
    });
  }
}

