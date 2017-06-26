import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appConfirmDelete]'
})
export class ConfirmDeleteDirective {
  CONFIRM_QUESTION = 'Чи підтверджуєте видалення?';
  @Input() appConfirmDelete = () => {};

  @HostListener('click', ['$event'])
  confirmFirst() {
    const confirmed = window.confirm('CONFIRM_QUESTION');

    if (confirmed) {
      this.appConfirmDelete();
    }
  }

}
