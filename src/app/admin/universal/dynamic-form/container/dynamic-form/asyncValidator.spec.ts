import {
  async,
  TestBed,
  fakeAsync,
  tick, ComponentFixture,
} from '@angular/core/testing';
import {GetRecordsBySearchService} from "../../../../services/get-records-by-search.service";
import {DynamicFormComponent} from "./dynamic-form.component";

class MockQuoteService {

 quote = 'olena';
  getQuote() {
    return Promise.resolve(this.quote);
  }
}
let comp: DynamicFormComponent;
let fixture: ComponentFixture<DynamicFormComponent>;



beforeEach(async(() => {
  TestBed.configureTestingModule({
    declarations: [ DynamicFormComponent ]
  }).overrideComponent(DynamicFormComponent, {
    set: {
      providers: [
        { provide: GetRecordsBySearchService, useClass: MockQuoteService },
      ]
    }
  }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DynamicFormComponent);
      comp = fixture.componentInstance;
      //service = fixture.debugElement.injector.get(GetRecordsBySearchService);
    });
}));
