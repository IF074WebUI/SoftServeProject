import {Component, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private toastr: ToastsManager, public  vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
  }

}
