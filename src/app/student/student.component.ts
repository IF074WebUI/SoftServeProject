import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentsService} from '../admin/students/students.service';
import {ResultsService} from '../admin/services/results.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {ToastsManager} from 'ng2-toastr';
import {SpinnerService} from '../admin/universal/spinner/spinner.service';
import {ViewContainerRef} from '@angular/core';
@Component({
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  objLoaderStatus: boolean;

  constructor(private loginService: LoginService,
              private router: Router,
              private spinner: SpinnerService,
              public  vRef: ViewContainerRef,
              private toastr: ToastsManager,


  ) {
    this.toastr.setRootViewContainerRef(vRef);

  }

  ngOnInit() {
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });

  }
  logout() {
    this.loginService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
