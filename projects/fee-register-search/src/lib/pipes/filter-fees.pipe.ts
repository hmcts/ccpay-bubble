import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], filter: string): IFee[] {
    if (!fees) { return []; }
    if (!filter) { return fees; }

    if (this.isNumeric(filter)) { return this.filterByAmount(fees, filter); }

    filter = filter.toLowerCase();

    if (this.isFeeCode(filter)) { return this.filterByFeeCode(fees, filter); }

    return this.filterByDescription(fees, filter);
  }

  filterByDescription(fees, filter): IFee[] {
    return fees.filter((fee: IFee) => {
      if (fee.current_version.description !== undefined) {
        return fee.current_version.description
          .toLowerCase()
          .includes(filter);
      }
    });
  }

  filterByAmount(fees, filter): IFee[] {
    return fees.filter((fee: IFee) => {
      if (fee.current_version.flat_amount !== undefined
      && fee.current_version.flat_amount.amount !== undefined) {
        return (fee.current_version.flat_amount.amount === Number(filter));
      }
    });
  }

  filterByFeeCode(fees, filter): IFee[] {
    return fees.filter((fee: IFee) => {
      if (fee.code !== undefined) {
        return fee.code
          .toLowerCase()
          .includes(filter);
      }
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  isFeeCode(value: string): boolean {
    return (new RegExp(/^[a-zA-Z]{3}\d{4}$/)).test(value);
  }
}
