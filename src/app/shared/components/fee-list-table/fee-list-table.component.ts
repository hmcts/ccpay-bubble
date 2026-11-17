import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';

@Component({
  selector: 'app-fee-list-table',
  standalone: false,
  templateUrl: './fee-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./fee-list-table.component.scss'],
})
export class FeeListTableComponent {
  @Input() fees: FeeModel[];
  @Input() isValid: boolean;
  @Input() showErrors: boolean;
  @Input() savedFee: FeeModel;
  @Output() feeChangedEventEmitter = new EventEmitter();

  selectFee($event: FeeModel) {
    this.feeChangedEventEmitter.emit($event);
  }
}
