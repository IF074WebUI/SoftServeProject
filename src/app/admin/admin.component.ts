import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './universal/spinner/spinner.service';
import {ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  objLoaderStatus: boolean;

  constructor(private spinner: SpinnerService,
              private toastr: ToastsManager,
              public  vRef: ViewContainerRef) {
    this.objLoaderStatus = false;
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });
  }
}

