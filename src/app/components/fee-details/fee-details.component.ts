import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFee} from '../../../../projects/fee-register-search/src/lib/interfaces';
import {FormBuilder, FormControl} from '@angular/forms';

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

  feeVolumeControl: FormControl;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.feeVolumeControl = this.formBuilder.control({value: 1, disabled: false});
  }

  goBack() {
    this.restartSearchEvent.emit();
  }

  submitVolume() {
    this.submitFeeVolumeEvent.emit(this.feeVolumeControl.value);
  }
}
