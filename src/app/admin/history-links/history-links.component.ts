import { Component, OnInit } from '@angular/core';
import {HistoryLinksService} from "../services/history-links.service";

@Component({
  selector: 'dtester-history-links',
  templateUrl: './history-links.component.html',
  styleUrls: ['./history-links.component.css']
})
export class HistoryLinksComponent implements OnInit {

  links: string[];

  constructor(private historyLinksService: HistoryLinksService) { }

  ngOnInit() {
    this.links = this.historyLinksService.linksList;
  }

}
