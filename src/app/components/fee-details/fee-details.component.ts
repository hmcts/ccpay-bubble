import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IFee} from '../../../../projects/fee-register-search/src/lib/interfaces';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-fee-details',
  templateUrl: './fee-details.component.html',
  styleUrls: ['./fee-details.component.scss']
})
export class FeeDetailsComponent implements OnInit {
  @Input() fee: IFee;
  @Output() submitFeeVolumeEvent: EventEmitter<IFee> = new EventEmitter();
  @Output() restartSearchEvent: EventEmitter<IFee> = new EventEmitter();

  feeDetailForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.feeDetailForm = new FormGroup({
      volumeAmount: new FormControl()
    });
  }

  goBack() {
    this.restartSearchEvent.emit();
  }

  submitVolume(fee: IFee) {
    this.submitFeeVolumeEvent.emit(this.feeDetailForm.get('volumeAmount').value);
  }
}
