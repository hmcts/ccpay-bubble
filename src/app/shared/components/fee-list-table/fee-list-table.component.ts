import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FeeModel } from 'src/app/models/FeeModel';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-fee-list-table',
  standalone: true,
  templateUrl: './fee-list-table.component.html',
  styleUrls: ['./fee-list-table.component.scss'],
  imports: [NgClass]
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
