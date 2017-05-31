import { Injectable } from '@angular/core';
import {Router, RoutesRecognized, Event} from '@angular/router';

@Injectable()
export class BreadcrumbsService {

  links: {path: string, queryP: {}}[] = [];

  constructor(private router: Router) {
    router.events.subscribe((event: Event) => { if (event instanceof RoutesRecognized) {
      if (!this.containsURL(this.links, event.url)) {
        if (this.links.length === 5) {
          this.links.shift();
        }
        this.links.push(this.transformLink(event.url));
      }
    }
    });
  }

  transformLink(link: string): {path: string, queryP: {}} {
    let questionPosition = link.indexOf('?');
    if (questionPosition === -1) {
      return {path: link , queryP: null};
    }
    let path = link.slice(0, questionPosition);
    return {path: path, queryP: this.formQueryParams(link.slice(questionPosition + 1))};
  }

  formQueryParams(s: string) {
    let queryParamsObj = {};
    let queryArr = s.split('&');
    for (let i = 0; i < queryArr.length; i++) {
      let expr = queryArr[i].split('=');
      queryParamsObj[expr[0]] = expr[1];
    }
    return queryParamsObj;
  }

  containsURL(l: {path: string, queryP: {}}[], url: string): boolean {
    for (let i = 0; i < l.length; i++) {
      if (this.concatPath(l[i]) === url) {
        return true;
      }
      }
      return false;
  }

  concatPath(p: {path: string, queryP: {}}): string {
    let result: string = p['path'];
    if (p['queryP']) {
      result += '?';
      let i = 1;
      for (let prop in p['queryP']) {
        result += prop + '=' + p['queryP'][prop] + (Object.keys(p['queryP']).length >= i ? '' : '&');
      }
    }
    return result;
  }

}
