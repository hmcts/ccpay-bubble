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
      console.log(filteredList);
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

  filterValidFee(fees: IFee[]) {
    return fees.filter(fee => fee.current_version);
  }

  filterValidDiscontinuedFee(fees: IFee[]) {
    return fees.filter(fee => fee.fee_versions ? fee.fee_versions : []);
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

    let filteredFees = this.filterBydisFee(fees, filter);
    return filteredFees.filter((fee: IFee) => {
      if (fee.current_version.flat_amount !== undefined
      && fee.current_version.flat_amount.amount !== undefined ) {
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

      if ( fee.isdiscontinued_fee !== undefined 
         && fee.isdiscontinued_fee === 1 ) {
          fee.sort_value = 1;
          return true;
      }
    
      return false;
    }).sort((a, b) => b.sort_value - a.sort_value);
  }

  filterBydisFee(fees, filter) {
    return fees.filter((fee: IFee) => {
     if (fee.fee_versions && fee.fee_versions.length > 0) {
       return fee.fee_versions.filter(oldFee => {
        if (oldFee.flat_amount !== undefined
          && oldFee.flat_amount.amount !== undefined) {
            if (oldFee.flat_amount.amount === Number(filter)) {
              fee.isdiscontinued_fee = 1;
              return true;
            }
          }
       });
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
