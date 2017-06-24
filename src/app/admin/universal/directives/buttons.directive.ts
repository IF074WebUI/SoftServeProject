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
    this.setColor('#6699ff');
    this.setFontWieght('bold');
  }
  onMouseLeave(){
    this.setColor('#eff5f5');
    this.setFontWieght('normal');
  }
  private setColor(val) {
    this.renderer.setElementStyle(this.element.nativeElement, 'background-color', val);
  }
  private setFontWieght(val) {
    this.renderer.setElementStyle(this.element.nativeElement, 'font-weight', val);
  }
}
