import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], filter: string, jurisdiction?: string[]): IFee[] {
    if (!fees) { return []; }
    if (!filter) { return fees; }

    let filteredList: IFee[] = [];

    if (this.isNumeric(filter)) {
      filteredList = this.filterByAmount(fees, filter);
    } else {
      filter = filter.toLowerCase();

      if (this.isFeeCode(filter)) { 
        filteredList = this.filterByFeeCode(fees, filter); 
      } else {
        filteredList = this.filterByDescription(fees, filter);
      }
    }
    if (filteredList && jurisdiction && jurisdiction.length > 0) {
      filteredList = this.filterByJurisdiction(filteredList, jurisdiction);
    }
    return filteredList;
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

  filterByJurisdiction(fees: IFee[], jurisdiction: string[]): IFee[] {
    return fees.filter((fee) => {
      for (let i = 0; i < jurisdiction.length; i++) {
        if (fee.jurisdiction1.name === jurisdiction[i]) {
          return true;
        }
      }
      return false;
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  isFeeCode(value: string): boolean {
    return (new RegExp(/^[a-zA-Z]{3}\d{4}$/)).test(value);
  }
}
