import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDisplayCurrency',
  standalone: false
})
export class FormatDisplayCurrencyPipe implements PipeTransform {
  transform(amount: any): string {
    return (amount === 0 || amount) ? `£ ${parseFloat(amount).toFixed(2)}` : '';
  }
}
