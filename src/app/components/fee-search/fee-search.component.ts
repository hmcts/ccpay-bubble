import {Component} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent {
  selectedFee: any;
  ccdNo: string = null;
  paymentGroupRef: string = null;

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

  selectFee(fee: any) {
    this.paymentGroupService.postPaymentGroup(fee).then(paymentGroup => {
      this.router.navigateByUrl(`/payment-history/${this.ccdNo}?view=fee-summary&paymentGroupRef=${paymentGroup.payment_group_reference}`);
    });
  }
}
