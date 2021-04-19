import { Pipe, PipeTransform } from '@angular/core';
import { IFee } from '../interfaces';
import { IVersion } from '../interfaces';
import { Jurisdictions } from '../models/Jurisdictions';

@Pipe({
  name: 'filterFees'
})
export class FilterFeesPipe implements PipeTransform {
  transform(fees: IFee[], searchFilter: string, jurisdictionsFilter?: Jurisdictions): IFee[] {
    if (!fees) { return []; }
    if (!searchFilter) { return fees; }

    let filteredList: IFee[] = [];

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

  filterValidFee(fees: IFee[]) {
    return fees.filter(fee => fee.current_version);
  }

  filterValidDiscontinuedFee(fees: IFee[]) {
    return fees.filter(fee => fee.fee_versions ? fee.fee_versions : []);
  }

  filterByDescription(fees, filter): IFee[] {
    const filterArray = filter.split(' ');
    return fees.filter((fee: IFee) => {
      if (this.validOldFeesVersions(fee).length > 0) {
        fee.discontinued_list = this.validOldFeesVersions(fee);
      }
      for (let i = 0; i < filterArray.length; i++) {
        if (!this.isConjunction(filterArray[i]) && fee.current_version !== undefined) {
          if (fee.current_version.description.toLowerCase().includes(filterArray[i])) {
            return true;
          }
        }
      }
      if ( fee.isdiscontinued_fee !== undefined
        && fee.isdiscontinued_fee === 1) {
        fee.sort_value = 1;
        return true;
    }
      return false;
    });
  }

  filterByNumber(fees, filter): IFee[] {
    const regExactWord = new RegExp(`\\b${filter}\\b`);
    const filteredFees = this.filterBydisFee(fees, filter);
    return filteredFees.filter((fee: IFee) => {
      if (this.validOldFeesVersions(fee).length > 0) {
        fee.discontinued_list = this.validOldFeesVersions(fee);
      }

      if (fee.current_version !== undefined &&
        ((fee.current_version.flat_amount && fee.current_version.flat_amount.amount)
        || (fee.current_version.volume_amount && fee.current_version.volume_amount.amount)
        || (fee.current_version.percentage_amount && fee.current_version.percentage_amount.percentage))) {
        fee.isCurrentAmount_available = 1;
      }

      if (fee.current_version !== undefined
        && fee.current_version.flat_amount !== undefined
        && fee.current_version.flat_amount.amount !== undefined) {
        if (fee.current_version.flat_amount.amount === Number(filter)) {
          fee.sort_value = 1;
          return true;
        }
      }

      if (fee.current_version !== undefined
        && fee.current_version.description !== undefined) {
        if (regExactWord.test(fee.current_version.description)) {
          fee.sort_value = 0;
          return true;
        }
      }

      if ( fee.isdiscontinued_fee !== undefined
          && fee.isdiscontinued_fee === 1) {
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

  validOldFeesVersions(feesObject: any) {
    const validOldFeeVersionArray = new Array();
    let validOldVersionArray: IVersion[] = [];

    if ((feesObject.current_version !== undefined && feesObject.fee_versions.length > 1)
        || (feesObject.current_version === undefined && feesObject.fee_versions.length > 0)) {
      /* sort based on valid from */
      feesObject.fee_versions = feesObject.fee_versions.
        filter(feesVersion => feesVersion.status === 'approved')
        .sort((a, b) => {
          return <any>new Date(b.valid_from) - <any>new Date(a.valid_from);
        });

      feesObject.fee_versions.forEach((value, i) => {
        if (i !== 0) {
          // if amount is diffrent then only consider it for push need to confirm that as well
          if (this.getAmountFromFeeVersion(value) === this.getAmountFromFeeVersion(feesObject.fee_versions[i - 1])) {
            return;
          }

          //  set valid to date if not present for fee version from previous version
          if (value.valid_to === null) {
            const oldFeeVersionPreviousIndex = validOldFeeVersionArray.length - 1;
            const new_valid_to = new Date(validOldFeeVersionArray[oldFeeVersionPreviousIndex].valid_from);
            new_valid_to.setDate(new_valid_to.getDate() - 1);
            value.valid_to = new_valid_to.toDateString();
          }
        }
        if (feesObject.current_version === undefined && feesObject.fee_versions.length === 1) {
            //  set valid to date if not present for fee version from previous version
            if (value.valid_to === null) {
              const oldFeeVersionPreviousIndex = 0 ;
              const new_valid_to = new Date(validOldFeeVersionArray[oldFeeVersionPreviousIndex].valid_from);
              new_valid_to.setDate(new_valid_to.getDate() - 1);
              value.valid_to = new_valid_to.toDateString();
            }
        }

        validOldFeeVersionArray.push(value);
      });
    }

  if ((feesObject.current_version !== undefined && validOldFeeVersionArray.length > 1)
  || (feesObject.current_version === undefined && validOldFeeVersionArray.length > 0)) {
      validOldVersionArray = validOldFeeVersionArray.filter(feesVersion => this.getValidFeeVersionsBasedOnDate(feesVersion));
      return validOldVersionArray;
    } else {
      return validOldVersionArray = [];
    }
  }

  getValidFeeVersionsBasedOnDate(feeVersion: IVersion) {
    const feesLimitDate = new Date();
    /* Check valid fees till 6 months  */
    feesLimitDate.setMonth(feesLimitDate.getMonth() - 6);

    const vaidFrom = feeVersion.valid_from;
    const valid_to = feeVersion.valid_to;

    if ((vaidFrom != null && <any>new Date(vaidFrom) > feesLimitDate) ||
      (valid_to != null && <any>new Date(valid_to) > feesLimitDate)) {
      return true;
    }
    return false;
  }

  getAmountFromFeeVersion(feeVersion: any) {
    if (feeVersion['volume_amount'] != null) {
      return feeVersion['volume_amount'].amount;
    } else if (feeVersion['flat_amount'] != null) {
      return feeVersion['flat_amount'].amount;
    } else if (feeVersion['percentage_amount'] != null) {
      return feeVersion['percentage_amount'].percentage;
    }
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
      if (this.validOldFeesVersions(fee).length > 0) {
        fee.discontinued_list = this.validOldFeesVersions(fee);
      }
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
