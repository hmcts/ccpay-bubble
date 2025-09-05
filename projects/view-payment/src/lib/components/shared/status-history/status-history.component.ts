import { Component, Input } from '@angular/core';
import { IStatusHistory } from '../../../interfaces/IStatusHistory';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'ccpay-status-history',
    templateUrl: './status-history.component.html',
    imports: [DatePipe]
})
export class StatusHistoryComponent {
  @Input() statusHistory: IStatusHistory;
}
