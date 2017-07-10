import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appButtons]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class ButtonsDirective {

  constructor(private element: ElementRef, private renderer: Renderer){

    this.renderer.setElementStyle(this.element.nativeElement, 'cursor', 'pointer');
  }

  onMouseEnter(){
    this.setFontWieght('bold');
  }
  onMouseLeave(){
    this.setFontWieght('normal');
  }

  private setFontWieght(val) {
    this.renderer.setElementStyle(this.element.nativeElement, 'font-weight', val);
  }
}
