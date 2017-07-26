import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.css']
})
export class BadRequestComponent implements OnInit {

  constructor(private location: Location,  private route: ActivatedRoute,
              private router: Router,) {}
error: string;

  ngOnInit() {
    this.error = this.route.snapshot.queryParams['error'];
  }


  goBack(): void {
    this.location.back();
  }
}
