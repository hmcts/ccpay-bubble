import { Component, Input } from '@angular/core';
import { IStatusHistory } from '../../../interfaces/IStatusHistory';
import { NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'ccpay-status-history',
  standalone: true,
  templateUrl: './status-history.component.html',
  imports: [NgIf, DatePipe]
})
export class StatusHistoryComponent {
  @Input() statusHistory: IStatusHistory;
}
