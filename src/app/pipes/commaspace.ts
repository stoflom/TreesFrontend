import { Pipe, PipeTransform } from '@angular/core';
/*
 * Joins array with [comma][space] to allow linebreaks
 * Example:
 *   {{ basboom,dikbas | ! CommaSpace }}
 *   formats to: basboom, dikbas
*/
@Pipe({
  name: 'commaSpace'
})
export class CommaSpacePipe implements PipeTransform {
  transform(value: string[]): string {
    return value.join(', ');
  }
}