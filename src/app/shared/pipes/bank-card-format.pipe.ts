import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bankCardFormat'
})
export class BankCardFormatPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    return value ? value.replace(/(.{4})/g,"$1 ") : '';
  }
}
