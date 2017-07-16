import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TestPlayerService} from '../test-player/test-player.service';
import {InitialRezults} from '../test-player/test-player.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-test-rezults',
  templateUrl: './test-rezults.component.html',
  styleUrls: ['./test-rezults.component.scss']
})
export class TestRezultsComponent implements OnInit, OnDestroy {
  message: any;
  subscription: Subscription;
  initialRezults: any;
  rezults: InitialRezults;

  constructor(private test_player: TestPlayerService, private router: Router) {
    this.initialRezults = new InitialRezults(0, 0, 0, 0, NaN);
  }

  ngOnInit() {
    this.subscription = this.test_player.getRezults().subscribe(resp => {
      this.rezults = resp;
      console.log(resp);
    });
  }
  goHome(){
    this.router.navigate(['./student']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
