import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFee } from '../../interfaces';
import { Jurisdictions } from '../../models/Jurisdictions';

@Component({
  selector: 'pay-fee-list',
  standalone:false,
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.scss']
})
export class FeeListComponent {
  @Input() fees?: IFee[];
  @Input() searchFilter?: string;
  @Input() jurisdictionsFilter?: Jurisdictions;
  @Output() selectedFeeEvent: EventEmitter<IFee> = new EventEmitter();
  p = 1;

  selectFee(fee: IFee) {
    this.selectedFeeEvent.emit(fee);
  }
  capitalise(str: string): string {
    return str
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }

  shouldShowHistoricalAmount(fee: IFee): boolean {
    if (!fee || fee.isCurrentAmount_available !== 1 || !fee.current_version || !fee.current_version.valid_from) {
      return false;
    }

    const currentVersionStartDate = new Date(fee.current_version.valid_from);
    if (isNaN(currentVersionStartDate.getTime())) {
      return false;
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return currentVersionStartDate >= sixMonthsAgo;
  }
}
