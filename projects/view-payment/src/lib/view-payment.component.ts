import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ViewPaymentService } from './view-payment.service';
import { IPayment } from './interfaces';

@Component({
  selector: 'ccpay-view-payment',
  templateUrl: './view-payment.component.html'
})
export class ViewPaymentComponent implements OnInit {
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
