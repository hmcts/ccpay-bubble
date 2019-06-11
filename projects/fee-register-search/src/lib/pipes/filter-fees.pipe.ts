import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], searchFilter: string, jurisdictionsFilter?: string[]): IFee[] {
    if (!fees) { return []; }
    if (!searchFilter) { return fees; }

    let filteredList: IFee[] = [];

    if (this.isNumeric(searchFilter)) {
      filteredList = this.filterByAmount(fees, searchFilter);
    } else {
      searchFilter = searchFilter.toLowerCase();

      if (this.isFeeCode(searchFilter)) {
        filteredList = this.filterByFeeCode(fees, searchFilter);
      } else {
        filteredList = this.filterByDescription(fees, searchFilter);
      }
    }
    if (filteredList && jurisdictionsFilter && jurisdictionsFilter.length > 0) {
      filteredList = this.filterByJurisdictions(filteredList, jurisdictionsFilter);
    }
    return filteredList;
  }

  filterByDescription(fees, filter): IFee[] {
    const filterArray = filter.split(' ');
    return fees.filter((fee: IFee) => {
      for (let i = 0; i < filterArray.length; i++) {
        if (!this.isConjunction(filterArray[i])) {
          if (fee.current_version.description.toLowerCase().includes(filterArray[i])) {
            return true;
          }
        }
      }
      return false;
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

  filterByJurisdictions(fees: IFee[], jurisdiction: string[]): IFee[] {
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

  isConjunction(word: string) {
    const conjuctions = ['and', 'nor', 'but', 'or', 'yet', 'so', 'of'];
    return conjuctions.find((str) => str === word);
  }
}
