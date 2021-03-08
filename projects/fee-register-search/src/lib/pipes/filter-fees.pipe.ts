import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';
import { Jurisdictions } from '../models/Jurisdictions';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], searchFilter: string, jurisdictionsFilter?: Jurisdictions): IFee[] {
    if (!fees) { return []; }
    if (!searchFilter) { return fees; }

    let filteredList: IFee[] = [];

    fees = this.filterValidFee(fees);

    if (this.isNumeric(searchFilter)) {
      filteredList = this.filterByNumber(fees, searchFilter);
    } else {
      searchFilter = searchFilter.toLowerCase();

      if (this.isFeeCode(searchFilter)) {
        filteredList = this.filterByFeeCode(fees, searchFilter);
      } else {
        filteredList = this.filterByDescription(fees, searchFilter);
      }
    }
    if (filteredList && jurisdictionsFilter) {
      filteredList = this.filterByJurisdictions(filteredList, jurisdictionsFilter);
    }
    return filteredList;
  }

  filterValidFee(fees: IFee[]) {
        const todayDate = new Date();
        return fees.filter(fee => fee.current_version.status === 'approved' &&  
                              <any>new Date(fee.current_version.valid_from) <= todayDate &&
                              (fee.current_version.valid_to === ' ' || 
                              fee.current_version.valid_to === '' || 
                               fee.current_version.valid_to === null || 
                               fee.current_version.valid_to === undefined || 
                              <any>new Date(fee.current_version.valid_to) >= todayDate));
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

  filterByNumber(fees, filter): IFee[] {
    const regExactWord = new RegExp(`\\b${filter}\\b`);
    return fees.filter((fee: IFee) => {
      if (fee.current_version.flat_amount !== undefined
      && fee.current_version.flat_amount.amount !== undefined) {
        if (fee.current_version.flat_amount.amount === Number(filter)) {
          fee.sort_value = 1;
          return true;
        }
      }
      if (fee.current_version.description !== undefined) {
        if (regExactWord.test(fee.current_version.description)) {
          fee.sort_value = 0;
          return true;
        }
      }
      return false;
    }).sort((a, b) => b.sort_value - a.sort_value);
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

  filterByJurisdictions(fees: IFee[], jurisdiction: Jurisdictions): IFee[] {
    return fees.filter((fee) => {
      return (jurisdiction.jurisdiction1 === '' || fee.jurisdiction1.name === jurisdiction.jurisdiction1)
      && (jurisdiction.jurisdiction2 === '' || fee.jurisdiction2.name === jurisdiction.jurisdiction2);
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  isFeeCode(value: string): boolean {
    return (new RegExp(/^[a-zA-Z]{3}\d{4}$/)).test(value);
  }

  isConjunction(word: string) {
    const conjuctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'of'];
    return conjuctions.find((str) => str === word);
  }
}
