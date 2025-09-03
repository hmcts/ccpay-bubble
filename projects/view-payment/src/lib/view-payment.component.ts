import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ViewPaymentService } from './view-payment.service';
import { IPayment } from './interfaces';
import { NgIf } from '@angular/common';
import { SinglePaymentViewComponent } from './components/single-payment-view/single-payment-view.component';

@Component({
    selector: 'ccpay-view-payment',
    templateUrl: './view-payment.component.html',
    imports: [NgIf, SinglePaymentViewComponent]
})
export class CcpayViewPaymentComponent implements OnInit {
  @Input() paymentReference: string;
  payment?: IPayment;
  errorMessage?: string;

  constructor(
    private viewPaymentService: ViewPaymentService
  ) { }

  ngOnInit() {
    this.viewPaymentService.getPaymentDetail(this.paymentReference).subscribe(
      (payment: IPayment) => this.payment = payment,
      (err: string) => this.errorMessage = err
    );
  }
}
