

import {DynamicFormComponent, validateEmail} from './dynamic-form.component';
import {
  async,
  inject,
  TestBed,
} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';

describe('Validate email validator', () => {

  // beforeEach(() => {
  //
  // });

  it('should be valid', () => {
    let formGroup = new FormControl('olena@ukr.net');
    // this.formGroup.setValue('olena@ukr.net');
    expect(validateEmail(formGroup)
    ).toBe(null);
  });


  it('should be invalid', () => {
    let formGroup = new FormControl('olena.ukr.net');
    // this.formGroup.setValue('olena@ukr.net');
    expect(validateEmail(formGroup).validateEmail.valid
    ).toBe(false);
  });



});
