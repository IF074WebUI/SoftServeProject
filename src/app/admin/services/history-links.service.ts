import { Injectable } from '@angular/core';
import {Router, RoutesRecognized, Event} from "@angular/router";

@Injectable()
export class HistoryLinksService {

  linksList: string[] = [];

  constructor(private router: Router) {
    router.events.subscribe((event: Event)=> { if (event instanceof RoutesRecognized) {
      if (this.linksList.indexOf(event.url) === -1) {
        if (this.linksList.length === 5) {
          this.linksList.shift();
        }
        this.linksList.push(event.url);
      }
    }
    })
  }

}
