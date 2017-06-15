import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '../services/breadcrumbs.service';

@Component({
  selector: 'dtester-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  links: {path: string, name: string}[] = [];

  constructor(private breadcrumbsService: BreadcrumbsService) { }

  ngOnInit() {
    this.breadcrumbsService.linksS.subscribe(l => this.links = l);
  }
}
