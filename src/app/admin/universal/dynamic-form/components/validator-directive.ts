import { Directive, forwardRef } from "@angular/core";
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Rx";

const validateUniqueEmailObservable = ( name : string ) => {

  return new Observable(observer => {
    if( name === "olena" ) {
      observer.next({asyncInvalid: true});
      observer.complete();
    } else {
      observer.next(null);
    }
  });
  }


@Directive({
  selector: "[asyncValidator][formControlName], [asyncValidator][ngModel]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AsyncValidator), multi: true
    }
  ]
})

export default class AsyncValidator implements Validator {

   validate( c : AbstractControl ) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> {
    return validateUniqueEmailObservable(c.value);
  }


}
