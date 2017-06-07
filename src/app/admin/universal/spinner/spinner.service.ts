import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SpinnerService {
  public loaderStatus: Subject<boolean> = new Subject<boolean>();

  showSpinner() {
    this.loaderStatus.next(true);
  }

  hideSpinner() {
    this.loaderStatus.next(false);
  }

}
