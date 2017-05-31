import {PipeTransform, Pipe} from '@angular/core';

@Pipe({
  name: 'links'
})
export class LinksPipe implements PipeTransform {

  transform(value: string = ''): string {
    let start = value.lastIndexOf('/') + 1;
    let end = value.indexOf('?') === -1 ? value.length : value.indexOf('?');
    return value.slice(start, end);
  }
}
