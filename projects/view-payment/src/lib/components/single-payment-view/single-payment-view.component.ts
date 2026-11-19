import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IPayment } from '../../interfaces';

@Component({
  selector: 'ccpay-single-payment-view',
  standalone: false,
  templateUrl: './single-payment-view.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./single-payment-view.component.scss']
})
export class SinglePaymentViewComponent {
  @Input() payment: IPayment;
}
