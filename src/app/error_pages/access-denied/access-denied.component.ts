import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
  goBack(): void {
    this.location.back();
  }
}
