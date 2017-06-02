import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './universal/spinner/spinner.service';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  objLoaderStatus: boolean;
  constructor ( private spinner: SpinnerService) {
    this.objLoaderStatus = false;
  }
  ngOnInit() {
    this.spinner.loaderStatus.subscribe((val: boolean) => {
      this.objLoaderStatus = val;
    });
  }
}
