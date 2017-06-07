import { Injectable } from '@angular/core';
import {Router, Event, NavigationEnd} from '@angular/router';
import {Subject} from "rxjs/Subject";

@Injectable()
export class BreadcrumbsService {

  linksS: Subject<{path: string, name: string}[]> = new Subject();
  links: {path: string, name: string}[];

  constructor(private router: Router) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let urls: string[] = this.parseURL(event.url);

          this.links = [];
          for (let url of urls) {
            this.links.push({path: this.generatePath(url, event.url), name: url});
          }
          this.linksS.next(this.links);
      }
    });
  }

  parseURL(url: string): string[] {
    let i: number = url.indexOf('?');
    url = url.slice(0, i);
    return url.split('/').slice(2);
  }

  generatePath(url: string, fullUrl: string): string {
    let i: number = fullUrl.indexOf(url);
    return fullUrl.slice(0, i) + url;
  }
}
