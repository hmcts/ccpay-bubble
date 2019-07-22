import {Component, OnInit} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';
import {IFee} from '@hmcts/ccpay-web-component/lib/interfaces/IFee';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  selectedFee: any;
  ccdNo: string = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentGroupService: PaymentGroupService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ccdNo = this.activatedRoute.snapshot.queryParams['ccdCaseNumber'];
    });
  }

  selectFee(fee: IFee) {
    const paymentGroup = <IPaymentGroup>{
      fees: [fee],
      remissions: null,
      payments: null,
      payment_group_reference: null
    };
    this.paymentGroupService.postPaymentGroup(paymentGroup).then(paymentGroupReceived => {
      this
        .router
        .navigateByUrl(`/payment-history/${this.ccdNo}`
          + `?view=fee-summary&paymentGroupRef=${paymentGroupReceived.payment_group_reference}`);
    });
  }
}
