import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SpinnerService {
  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showSpinner() {
    setTimeout(() => this.loaderStatus.next(true), 0);
  }

  hideSpinner() {
    setTimeout(() => this.loaderStatus.next(false), 0);
  }

}
