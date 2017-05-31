import { Component, OnInit } from '@angular/core';
import {BreadcrumbsService} from '../services/breadcrumbs.service';

@Component({
  selector: 'dtester-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  links: string[];

  constructor(private historyLinksService: BreadcrumbsService) { }

  ngOnInit() {
    this.links = this.historyLinksService.linksList;
  }

}
