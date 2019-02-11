import { Pipe, PipeTransform } from '@angular/core';
import {CommonModule} from '@angular/common';

@Pipe({
  name: 'formatDisplayCurrency'
})
export class FormatDisplayCurrencyPipe implements PipeTransform {
  transform(amount: string): string {
    return amount ? `£ ${parseFloat(amount).toFixed(2)}` : '';
  }
}
