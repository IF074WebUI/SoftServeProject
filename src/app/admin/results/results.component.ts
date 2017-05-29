import { Component, OnInit } from '@angular/core';
import {ResultsService} from '../services/results.service';
import {Result} from './result';

@Component({
  selector: 'dtester-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  RESULTS_HEADERS: string[] = ['№', 'id студента', 'id тесту', 'дата', 'початок', 'закінчення', 'результат', 'запитання'];
  IGNORE_PROPERTIES: string[] = ['session_id', 'true_answers', 'answers'];

  results: Result[];

  constructor(private resultsService: ResultsService) {
  }

  ngOnInit() {
    this.resultsService.getAll().subscribe((resp: Result[]) => {resp.forEach((res: Result) => {
      res.questions = res.questions.replace(new RegExp('&quot;', 'g'), '');
    }); this.results = resp; } );
    };
}
