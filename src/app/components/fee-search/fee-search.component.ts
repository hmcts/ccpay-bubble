import {Component} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';

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
    private paymentGroupService: PaymentGroupService
  ) {
  }

  selectFee(fee: any) {
    this.paymentGroupService.postPaymentGroup(fee).then(paymentGroup => {
      this.paymentGroupRef = paymentGroup.payment_group_reference;
    });
    this.selectedFee = fee;
    console.log(fee);
  }
}
