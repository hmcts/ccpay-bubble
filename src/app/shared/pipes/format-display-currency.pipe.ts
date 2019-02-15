import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDisplayCurrency'
})
export class FormatDisplayCurrencyPipe implements PipeTransform {
  transform(amount: string): string {
    return amount ? `£ ${parseFloat(amount).toFixed(2)}` : '';
  }
}
