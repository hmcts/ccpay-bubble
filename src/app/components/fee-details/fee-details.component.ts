import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFee} from '../../../../projects/fee-register-search/src/lib/interfaces';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-fee-details',
  templateUrl: './fee-details.component.html',
  styleUrls: ['./fee-details.component.scss']
})
export class FeeDetailsComponent implements OnInit {
  @Input() fee = {
                        code: 'test-code',
                        fee_type: 'banded',
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
  @Output() submitFeeVolumeEvent: EventEmitter<IFee> = new EventEmitter();
  @Output() restartSearchEvent: EventEmitter<IFee> = new EventEmitter();

  feeDetailFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
     this.feeDetailFormGroup = this.formBuilder.group({
          feeVolumeControl : new FormControl({value: 1, disabled: false}),
          feeAmountFormControl : new FormControl({value: '0', disabled: false})
     });
  }

  goBack() {
    this.restartSearchEvent.emit();
  }

  submitVolume() {
    if (this.fee.current_version.flat_amount !== undefined) {
      this.fee.current_version.flat_amount.amount = this.feeDetailFormGroup.get('feeAmountFormControl').value;
    }
    this.submitFeeVolumeEvent.emit(this.feeDetailFormGroup.get('feeVolumeControl').value);
  }
}
