import { Component, Input } from '@angular/core';
import { IStatusHistory } from '../../../interfaces/IStatusHistory';

@Component({
  selector: 'ccpay-status-history',
  standalone: false,
  templateUrl: './status-history.component.html'
})
export class StatusHistoryComponent {
  @Input() statusHistory: IStatusHistory;
}
