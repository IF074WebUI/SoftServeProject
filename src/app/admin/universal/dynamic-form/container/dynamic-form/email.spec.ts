
import {validateEmail} from './dynamic-form.component';
import {FormControl} from '@angular/forms';

describe('Validate email validator', () => {

  it('should be valid', () => {
    let formGroup = new FormControl('olena@ukr.net');
    expect(validateEmail(formGroup)
    ).toBe(null);
  });


  it('should be invalid', () => {
    let formGroup = new FormControl('olena.ukr.net');
    expect(validateEmail(formGroup).validateEmail.valid
    ).toBe(false);
  });

});
