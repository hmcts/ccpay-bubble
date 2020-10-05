import { FeeDetailsComponent } from './../fee-details/fee-details.component';
import { IVersion } from './../../../../dist/fee-register-search/lib/interfaces/IVersion.d';
import { Component, OnInit } from '@angular/core';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFee } from '../../../../projects/fee-register-search/src/lib/interfaces';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  outputEmitterFeesDetails: { volumeAmount: number, selectedVersionEmit: IVersion };
  selectedFee: any;
  ccdNo: string = null;
  dcnNo: string = null;
  preselectedFee: IFee;
  showFeeDetails = false;
  paymentGroupRef: string = null;
  selectedOption: string = null;
  bulkScanningTxt = '&isBulkScanning=Enable&isTurnOff=Enable';
  isDiscontinuedFeatureEnabled = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentGroupService: PaymentGroupService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ccdNo = this.activatedRoute.snapshot.queryParams['ccdCaseNumber'];
      this.paymentGroupRef = this.activatedRoute.snapshot.queryParams['paymentGroupRef'];
      this.dcnNo = this.activatedRoute.snapshot.queryParams['dcn'];
      this.selectedOption = this.activatedRoute.snapshot.queryParams['selectedOption'];
      this.bulkScanningTxt = this.activatedRoute.snapshot.queryParams['isBulkScanning'] === 'Enable' ?
                                  '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isTurnOff'] === 'Enable' ?
                                  '&isTurnOff=Enable' : '&isTurnOff=Disable';
      this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isOldPcipalOff'] === 'Enable' ?
                                  '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
      this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isNewPcipalOff'] === 'Enable' ?
                                  '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
    });

    this.paymentGroupService.getDiscontinuedFrFeature().then((status) => {
      this.isDiscontinuedFeatureEnabled = status;
    });
  }

  selectFee(fee: IFee) {
    const feeType = fee.fee_type;
    const volAmt = fee.current_version['volume_amount'];
    const flatAmt = fee.current_version['flat_amount'];
    const percentageAmt = fee.current_version['percentage_amount'];
    let paymentGroup;
    const feeDetailsComponent = new FeeDetailsComponent(null, null);

    if ((feeType === 'fixed' && volAmt)
      || (feeType === 'banded' && flatAmt)
      || (feeType === 'rateable' && flatAmt)
      || (feeType === 'ranged' && percentageAmt)
      || (this.isDiscontinuedFeatureEnabled && fee.fee_versions.length > 1 && feeDetailsComponent.validOldFeesVersions(fee).length > 1)) {
      this.preselectedFee = fee;
      this.showFeeDetails = true;
    } else {
      paymentGroup = {
        fees: [{
          code: fee.code,
          version: fee['current_version'].version.toString(),
          'calculated_amount': fee['current_version'].flat_amount.amount.toString(),
          'memo_line': fee['current_version'].memo_line,
          'natural_account_code': fee['current_version'].natural_account_code,
          'ccd_case_number': this.ccdNo,
          jurisdiction1: fee.jurisdiction1['name'],
          jurisdiction2: fee.jurisdiction2['name'],
          description: fee.current_version.description,
          volume: fee.fee_type === 'relational' ? null : 1,
          fee_amount: fee['current_version'].flat_amount.amount.toString()
        }]
      };
      this.sendPaymentGroup(paymentGroup);
    }
  }

  onGoBack() {
    this.preselectedFee = null;
    this.showFeeDetails = false;
  }

  selectPreselectedFeeWithVolume(submitFeeVolumeEvent) {
    this.outputEmitterFeesDetails = submitFeeVolumeEvent;
    let selectedFeeVersion = this.outputEmitterFeesDetails.selectedVersionEmit;

    const fee = this.preselectedFee;
    if (selectedFeeVersion === null || typeof selectedFeeVersion === 'undefined') {
      selectedFeeVersion = fee['current_version'];
    }

    const volAmt = selectedFeeVersion['volume_amount'];
    const flatAmt = selectedFeeVersion['flat_amount'];
    const percentageAmt = selectedFeeVersion['percentage_amount'];
    const fee_amount = volAmt ? volAmt.amount : (flatAmt ? flatAmt.amount : percentageAmt.percentage);
    const amount = fee_amount ? fee_amount : percentageAmt;
    const paymentGroup = {
      fees: [{
        code: fee.code,
        version: selectedFeeVersion.version.toString(),
        'calculated_amount': (fee.fee_type === 'rateable' || fee.fee_type === 'ranged')
          ? this.outputEmitterFeesDetails.volumeAmount : (fee_amount * this.outputEmitterFeesDetails.volumeAmount).toString(),
        'memo_line': selectedFeeVersion.memo_line,
        'natural_account_code': selectedFeeVersion.natural_account_code,
        'ccd_case_number': this.ccdNo,
        jurisdiction1: fee.jurisdiction1['name'],
        jurisdiction2: fee.jurisdiction2['name'],
        description: selectedFeeVersion.description,
        volume: fee.fee_type === 'rateable' || fee.fee_type === 'ranged' ? null : this.outputEmitterFeesDetails.volumeAmount,
        fee_amount: amount
      }]
    };

    this.sendPaymentGroup(paymentGroup);
  }

  sendPaymentGroup(paymentGroup: any) {
    const dcnQueryParams = this.dcnNo ? `&dcn=${this.dcnNo}` : '';

    if (this.paymentGroupRef) {

      this.paymentGroupService.putPaymentGroup(this.paymentGroupRef, paymentGroup)
        .then(response => {
         // tslint:disable-next-line:max-line-length
          let url = `/payment-history/${this.ccdNo}?view=fee-summary&selectedOption=${this.selectedOption}&paymentGroupRef=${this.paymentGroupRef}${dcnQueryParams}${this.bulkScanningTxt}`;
          url = url.replace(/[\r\n]+/g, ' ');
          this.router.navigateByUrl(url);
        })
        .catch(err => {
          this.navigateToServiceFailure();
        });
    } else {
      this.paymentGroupService.postPaymentGroup(paymentGroup).then(paymentGroupReceived => {
        // tslint:disable-next-line:max-line-length
        let url = `/payment-history/${this.ccdNo}?view=fee-summary&selectedOption=${this.selectedOption}&paymentGroupRef=${JSON.parse(<any>paymentGroupReceived)['data'].payment_group_reference}${dcnQueryParams}${this.bulkScanningTxt}`;
        url = url.replace(/[\r\n]+/g, ' ');
        this.router.navigateByUrl(url);
      })
        .catch(err => {
          this.navigateToServiceFailure();
        });
    }
  }

  navigateToServiceFailure() {
    this.router.navigateByUrl('/service-failure');
  }

}
