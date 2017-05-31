import { Component, OnInit } from '@angular/core';
import {BreadcrumbsService} from '../services/breadcrumbs.service';

@Component({
  selector: 'dtester-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  links: {path: string, queryP: {}}[];

  constructor(private breadcrumbsService: BreadcrumbsService) { }

  ngOnInit() {
    this.links = this.breadcrumbsService.links;
  }
}
