import { IVersion } from './../../../../projects/fee-register-search/src/lib/interfaces/IVersion';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFee } from '../../../../projects/fee-register-search/src/lib/interfaces';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-fee-details',
  templateUrl: './fee-details.component.html',
  styleUrls: ['./fee-details.component.scss']
})
export class FeeDetailsComponent implements OnInit {
  selectedFeeVersion: IVersion;
  validOldVersionArray: IVersion[];
  @Input() fee = {
    code: 'test-code',
    fee_type: 'banded',
    fee_versions: [
      {
        description: 'Recovery order (section 50)',
        status: 'approved',
        author: '126172',
        approvedBy: '126175',
        version: 1,
        valid_from: '2014-04-21T00:00:00.000+0000',
        valid_to: '2014-04-21T00:00:00.000+0000',
        flat_amount: {
          'amount': 215
        },
        memo_line: 'RECEIPT OF FEES - Family misc private',
        statutory_instrument: '2014 No 877 ',
        si_ref_id: '2.1q',
        natural_account_code: '4481102174',
        fee_order_name: 'Family Proceedings',
        direction: 'cost recovery'
      }
    ],
    'current_version': {
      version: 1,
      calculatedAmount: 1234,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      flat_amount: {
        amount: 1234
      },
      description: 'test-description'
    }

  };
  @Output() submitFeeVolumeEvent: EventEmitter<{ volumeAmount: number, selectedVersionEmit: IVersion }> = new EventEmitter();
  @Output() restartSearchEvent: EventEmitter<IFee> = new EventEmitter();

  feeDetailFormGroup: FormGroup;

  feeVolumeControl: FormControl;
  feeAmountFormControl: FormControl;
  calculatedAmountFormControl: FormControl;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.feeDetailFormGroup = this.formBuilder.group({
      feeOrVolumeControl: new FormControl({ value: 1, disabled: false }),
      feeAmountFormControl: new FormControl({ value: '0', disabled: false })
    });

    this.validOldFeesVersions();
  }

  goBack() {
    this.restartSearchEvent.emit();
  }

  submitVolume() {
    if (this.fee.current_version.flat_amount !== undefined && this.fee.fee_type === 'banded') {
      this.fee.current_version.flat_amount.amount = this.feeDetailFormGroup.get('feeAmountFormControl').value;

      if (this.selectedFeeVersion != null) {
           this.selectedFeeVersion.flat_amount.amount = this.feeDetailFormGroup.get('feeAmountFormControl').value;
      }
    }

    this.submitFeeVolumeEvent.emit({
      volumeAmount: this.feeDetailFormGroup.get('feeOrVolumeControl').value, selectedVersionEmit: this.selectedFeeVersion
    });
  }

  getSelectedFeesVersion(currentSelectedFeeVersion: IVersion) {
    this.selectedFeeVersion = currentSelectedFeeVersion;
  }

  validOldFeesVersions() {
    const validOldFeeVersionArray = new Array();

    if (this.fee.fee_versions.length > 1) {
      /* sort based on valid from */
      this.fee.fee_versions = this.fee.fee_versions.
        filter(feesVersion => feesVersion.status === 'approved')
        .sort((a, b) => {
          return <any>new Date(b.valid_from) - <any>new Date(a.valid_from);
        });



      console.log('List of all old fee versions', this.fee.fee_versions);

      this.fee.fee_versions.forEach(function (value, i) {
        if (i !== 0) {
          // if amount is diffrent then only consider it for push need to confirm that as well
          // if (this.getAmountFromFeeVersion(value) == this.getAmountFromFeeVersion(this.fee.fee_versions[i - 1])) {
          //   console.log('fee version deleted due to same amount with previous vesion ', value)
          //   return
          // }
          /* set valid to date if not present for fee version from previous version*/
          if (value.valid_to == null) {
            const new_valid_to = new Date(validOldFeeVersionArray[i - 1].valid_from);
            new_valid_to.setDate(new_valid_to.getDate() - 1);
            value.valid_to = new_valid_to.toDateString();
          }
        }
        validOldFeeVersionArray.push(value);
      });
    }
    console.log('Valid old fee version list', validOldFeeVersionArray);

    if (validOldFeeVersionArray.length > 1) {
      return this.validOldVersionArray = validOldFeeVersionArray.filter(feesVersion => this.getValidFeeVersionsBasedOnDate(feesVersion));
    } else {
      return this.validOldVersionArray = [];
    }
  }

  getValidFeeVersionsBasedOnDate(feeVersion: IVersion) {
    const feesLimitDate = new Date();
    /* Check valid fees till 6 months  */
    feesLimitDate.setMonth(feesLimitDate.getMonth() - 3);

    if (feeVersion.valid_from != null && <any>new Date(feeVersion.valid_from) > feesLimitDate) {
      return true;
    } else if (feeVersion.valid_to != null && <any>new Date(feeVersion.valid_to) > feesLimitDate) {
      return true;
    }
    return false;
  }

  getAmountFromFeeVersion(feeVersion: IVersion) {
    if (feeVersion['volume_amount'] != null) {
      return feeVersion['volume_amount'].amount;
    } else if (feeVersion['flat_amount'] != null) {
      return feeVersion['flat_amount'].amount;
    } else if (feeVersion['percentage_amount'] != null) {
      return feeVersion['percentage_amount'].percentage;
    }
  }
}
