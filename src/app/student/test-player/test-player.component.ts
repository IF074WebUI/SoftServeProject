import { Component, OnInit } from '@angular/core';
import {TestPlayerService} from "./test-player.service";

@Component({
  selector: 'app-test-player',
  templateUrl: './test-player.component.html',
  styleUrls: ['./test-player.component.css']
})
export class TestPlayerComponent implements OnInit {
test_id;
  constructor(private test_player: TestPlayerService) { }

  ngOnInit() {
    this.test_id = 13;
this.test_player.
  }

}
