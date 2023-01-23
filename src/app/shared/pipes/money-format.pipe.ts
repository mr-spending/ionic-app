import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mrMoneyFormat'
})
export class MrMoneyFormatPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (!value) return '';
    let newValue: string = value.toFixed(0);
    newValue = newValue.replace(/([0-9]{2})$/g, '.$1');
    let parts = newValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
    return parts.join('.');
  }
}
