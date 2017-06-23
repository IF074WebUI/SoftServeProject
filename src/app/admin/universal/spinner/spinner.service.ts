import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {BehaviorSubject} from "rxjs/BehaviorSubject";


@Injectable()
export class SpinnerService {
  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showSpinner() {
    this.loaderStatus.next(true);
  }

  hideSpinner() {
    this.loaderStatus.next(false);
  }

}
