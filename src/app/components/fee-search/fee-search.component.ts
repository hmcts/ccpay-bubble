import {Component} from '@angular/core';
import {AddFeeDetailService} from '../../services/add-fee-detail/add-fee-detail.service';
import {Router} from '@angular/router';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

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

  logFee(fee: any) {
    this.paymentGroupService.postPaymentGroup(fee).then(paymentGroup => {
      this.paymentGroupRef = paymentGroup.payment_group_reference;
    });
    this.selectedFee = fee;
    console.log(fee);
  }
}
