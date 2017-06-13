import { Directive, forwardRef } from "@angular/core";
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs/Rx";
@Directive({
  selector: '[asyncValidator][formControlName], [asyncValidator][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AsyncValidator), multi: true
    }
  ]
})

export default class AsyncValidator implements Validator {

  validate( c : AbstractControl ) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> {
    return this.validateUniqueEmailPromise(c.value);
  }

  validateUniqueEmailObservable( email : string ) {


    return new Observable(observer => {
      console.log('validate');
      if( email === "alreadyExistsEmail@gmail.com" ) {
        observer.next({asyncInvalid: true});
      } else {
        observer.next(null);
      }
    });
  }

  validateUniqueEmailPromise( email : string ) {
    return new Promise(resolve => {
      setTimeout(() => {
        if( email === "alreadyExistsEmail@gmail.com" ) {
          resolve({
            asyncInvalid: true
          })
        } else {
          resolve(null);
        }
      }, 4000);
    })
  }

}
