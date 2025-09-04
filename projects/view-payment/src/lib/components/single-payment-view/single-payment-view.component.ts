import { Component, Input } from '@angular/core';
import { IPayment } from '../../interfaces';

@Component({
  selector: 'ccpay-single-payment-view',
  templateUrl: './single-payment-view.component.html',
  styleUrls: ['./single-payment-view.component.scss']
})
export class SinglePaymentViewComponent {
  @Input() payment: IPayment;
}
