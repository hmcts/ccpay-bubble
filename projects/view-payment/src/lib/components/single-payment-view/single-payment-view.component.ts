import { Component, Input } from '@angular/core';
import { IPayment } from '../../interfaces';
import { NgIf, NgFor, DecimalPipe, DatePipe } from '@angular/common';
import { FeeComponent } from '../shared/fee/fee.component';
import { StatusHistoryComponent } from '../shared/status-history/status-history.component';

@Component({
    selector: 'ccpay-single-payment-view',
    templateUrl: './single-payment-view.component.html',
    styleUrls: ['./single-payment-view.component.scss'],
    imports: [NgIf, NgFor, FeeComponent, StatusHistoryComponent, DecimalPipe, DatePipe]
})
export class SinglePaymentViewComponent {
  @Input() payment: IPayment;
}
