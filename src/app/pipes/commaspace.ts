import { Pipe, PipeTransform } from '@angular/core';
import { IVegetationDocument } from '../interfaces/vegetation';

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
  transform(value: any[]): string {
    if (!value || value.length === 0) return '';
    return value.map(item => typeof item === 'string' ? item : (item as IVegetationDocument).name).join(', ');
  }
}