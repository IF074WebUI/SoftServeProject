import {Component, OnDestroy, OnInit} from '@angular/core';
import {TestPlayerService} from '../test-player/test-player.service';
import {InitialRezults} from '../classes';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'dtester-test-rezults',
  templateUrl: './test-rezults.component.html',
  styleUrls: ['./test-rezults.component.scss']
})
export class TestRezultsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  initialRezults: InitialRezults;
  rezults: InitialRezults;

  AVAILABLE_TESTS = 'Переглянути список доступних тестів';
  TEST_REZULTS = 'Результати тесту';
  MARK = 'Отримано балів';
  NUMBER_OF_TRUE_ANSWERS = 'Правильних відповідей';
  FROM = 'з';

  constructor(private test_player: TestPlayerService, private router: Router) {
    this.initialRezults = new InitialRezults(0, 0, 0, 0, NaN);
  }

  ngOnInit() {
    this.subscription = this.test_player.getRezults().subscribe(resp => {
      this.rezults = resp;
    });
  }

  goHome() {
    this.router.navigate(['./student/student-main']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
