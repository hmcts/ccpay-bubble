import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDisplayCurrency'
})
export class FormatDisplayCurrencyPipe implements PipeTransform {
  transform(amount: any): string {
    return (amount === 0 || amount) ? `£ ${parseFloat(amount).toFixed(2)}` : '';
  }
}
