import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DEBOUNCE_TIME } from "../../../constants";

@Component({
  selector: 'dtester-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  SEARCH_PLACEHOLDER: string = 'пошук...';

  @Output() searchCriteria: EventEmitter<string> = new EventEmitter();
  search: FormControl = new FormControl();

  constructor(private router: Router) { }

  ngOnInit() {
    this.search.valueChanges.debounceTime(DEBOUNCE_TIME).subscribe(val => this.searchCriteria.emit(val),
      err => this.router.navigate(['/bad_request']));
  }

}
