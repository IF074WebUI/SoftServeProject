import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.css']
})
export class BadRequestComponent implements OnInit {

  constructor(private location: Location) {}

  ngOnInit() {}
  goBack(): void {
    this.location.back();
  }
}
