import {Component, OnInit} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IFee} from '../../../../projects/fee-register-search/src/lib/interfaces';

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
    // TODO: check if fee is fixed and volume
    if (fee.fee_type === 'fixed' && fee.current_version['volume_amount']) {

    }
    // else: apply the existing solution

    const paymentGroup = {
      fees: [{
        code: fee.code,
        version: fee['current_version'].version.toString(),
        'calculated_amount': fee['current_version'].flat_amount.amount.toString(),
        'memo_line': fee['current_version'].memo_line,
        'natural_account_code': fee['current_version'].natural_account_code,
        'ccd_case_number': this.ccdNo,
        'net_amount': fee['current_version'].flat_amount.amount.toString(),
        jurisdiction1: fee.jurisdiction1['name'],
        jurisdiction2: fee.jurisdiction2['name'],
        description: fee.current_version.description
      }]
    };
    this.paymentGroupService.postPaymentGroup(paymentGroup).then(paymentGroupReceived => {
      const response: any = paymentGroupReceived;
      this
        .router
        .navigateByUrl(`/payment-history/${this.ccdNo}`
          + `?view=fee-summary&paymentGroupRef=${JSON.parse(response)['data'].payment_group_reference}`);
    });
  }
}
