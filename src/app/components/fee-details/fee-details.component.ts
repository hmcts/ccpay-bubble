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
  selectedFeeVersion: IVersion
  @Input() fee = {
    code: 'test-code',
    fee_type: 'banded',
    fee_versions: [
      {
        description: "Recovery order (section 50)",
        status: "approved",
        author: "126172",
        approvedBy: "126175",
        version: 1,
        valid_from: "2014-04-21T00:00:00.000+0000",
        valid_to: "2014-04-21T00:00:00.000+0000",
        flat_amount: {
          "amount": 215
        },
        memo_line: "RECEIPT OF FEES - Family misc private",
        statutory_instrument: "2014 No 877 ",
        si_ref_id: "2.1q",
        natural_account_code: "4481102174",
        fee_order_name: "Family Proceedings",
        direction: "cost recovery"
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
  }

  goBack() {
    this.restartSearchEvent.emit();
  }

  submitVolume() {
    if (this.fee.current_version.flat_amount !== undefined && this.fee.fee_type === 'banded') {
      this.fee.current_version.flat_amount.amount = this.feeDetailFormGroup.get('feeAmountFormControl').value;
    }

    this.submitFeeVolumeEvent.emit({ volumeAmount: this.feeDetailFormGroup.get('feeAmountFormControl').value, selectedVersionEmit: this.selectedFeeVersion });
  }

  getSelectedFeesVersion(currentSelectedFeeVersion: IVersion) {
    this.selectedFeeVersion = currentSelectedFeeVersion;
  }

  get validOldFeesVersions() {
    const feesLimitDate = new Date();
    /* Check valid fees till 6 months  */
    feesLimitDate.setMonth(feesLimitDate.getMonth() - 3);

    if (this.fee.fee_versions.length > 1) {
      return this.fee.fee_versions.filter(feesVersion => <any>new Date(feesVersion.valid_to) > feesLimitDate && feesVersion.status === 'approved')
        .sort((a, b) => {
          return <any>new Date(b.valid_to) - <any>new Date(a.valid_to);
        })
    }
    return [];
  }

  getAmountFromFeeVersion(feeVersion: IVersion) {
    if (feeVersion['volume_amount'] != null) {
      return feeVersion['volume_amount'].amount
    } else if (feeVersion['flat_amount'] != null) {
      return feeVersion['flat_amount'].amount
    } else if (feeVersion['percentage_amount'] != null) {
      return feeVersion['percentage_amount'].percentage
    }
  }
}
