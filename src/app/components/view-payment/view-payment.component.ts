import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html'
})
export class ViewPaymentComponent implements OnInit {
  paymentRef: string;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getPaymentRef().subscribe(paymentRef => {
      this.paymentRef = paymentRef;
    });
  }

  getPaymentRef(): Observable<string> {
    return this.route.params.pipe(
      map(params => params.ref)
    );
  }
}
