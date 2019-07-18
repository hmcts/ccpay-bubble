import {Component} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent {
  selectedFee: any;
  ccdNo = '1234';
  paymentGroupRef: string = null;

  constructor(
    private router: Router,
    private paymentGroupService: PaymentGroupService
  ) {
  }

  selectFee(fee: any) {
    this.paymentGroupService.postPaymentGroup(fee).then(paymentGroup => {
      this.router.navigateByUrl(`/payment-history/${this.ccdNo}?view=fee-summary&paymentGroupRef=${this.paymentGroupRef}`);
    });
  }
}
