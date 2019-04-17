import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], filter: string): IFee[] {
    if (!fees) { return []; }
    if (!filter) { return fees; }

    if (this.isNumeric(filter)) {
      return this.filterByAmount(fees, filter);
    }

    filter = filter.toLowerCase();
    return this.filterByDescription(fees, filter);
  }

  filterByDescription(fees, filter): IFee[] {
    return fees.filter((fee: IFee) => {
      if (fee.current_version.description) {
        return fee.current_version.description
          .toLowerCase()
          .includes(filter);
      }
    });
  }

  filterByAmount(fees, filter): IFee[] {
    return fees.filter((fee: IFee) => {
      if (fee.current_version.flat_amount
      && fee.current_version.flat_amount.amount) {
        return (fee.current_version.flat_amount.amount === Number(filter));
      }
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}
