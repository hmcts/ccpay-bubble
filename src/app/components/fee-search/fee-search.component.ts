import {Component, OnInit} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
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
    const paymentGroup = {
      fees: [{
        code: fee.code,
        version: fee['current_version'].version.toString(),
        calculatedAmount: fee['current_version'].flat_amount.amount.toString(),
        memoLine: fee['current_version'].memo_line,
        naturalAccountCode: fee['current_version'].natural_account_code,
        ccdCaseNumber: this.ccdNo,
        netAmount: fee['current_version'].flat_amount.amount.toString(),
        jurisdiction1: fee.jurisdiction1['name'],
        jurisdiction2: fee.jurisdiction2['name'],
        description: fee.description
      }]
    };
    this.paymentGroupService.postPaymentGroup(paymentGroup).then(paymentGroupReceived => {
      this
        .router
        .navigateByUrl(`/payment-history/${this.ccdNo}`
          + `?view=fee-summary&paymentGroupRef=${paymentGroupReceived.payment_group_reference}`);
    });
  }
}
