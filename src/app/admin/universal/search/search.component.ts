import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DEBOUNCE_TIME } from '../../../constants';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'dtester-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() searchCriteria: EventEmitter<string> = new EventEmitter();
            search: FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit() {
    this.search.valueChanges.debounceTime(DEBOUNCE_TIME).subscribe(val => this.searchCriteria.emit(val),
      err => this.router.navigate(['/bad_request']));
  }

}
