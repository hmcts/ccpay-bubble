import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IStatusHistory } from '../../../interfaces/IStatusHistory';

@Component({
  selector: 'ccpay-status-history',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './status-history.component.html'
})
export class StatusHistoryComponent {
  @Input() statusHistory: IStatusHistory;
}
