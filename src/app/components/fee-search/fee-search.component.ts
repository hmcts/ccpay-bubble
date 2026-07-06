import { FeeDetailsComponent } from './../fee-details/fee-details.component';
import { IVersion } from './../../../../projects/fee-register-search/src/lib/interfaces/IVersion';
import { Component, OnInit } from '@angular/core';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IFee } from '../../../../projects/fee-register-search/src/lib/interfaces';
import * as ls from 'local-storage';

@Component({
  selector: 'app-fee-search',
  standalone: false,
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  outputEmitterFeesDetails: { volumeAmount: number, selectedVersionEmit: IVersion, isDiscontinuedFeeAvailable: boolean};
  selectedFee: any;
  ccdNo: string = null;
  dcnNo: string = null;
  preselectedFee: IFee;
  showFeeDetails = false;
  paymentGroupRef: string = null;
  selectedOption: string = null;
  bulkScanningTxt = '&isBulkScanning=Enable&isTurnOff=Enable';
  isDiscontinuedFeatureEnabled = false;
  lsCcdNumber: any = ls.get<any>('ccdNumber');

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentGroupService: PaymentGroupService
  ) {
  }

  async ngOnInit() {
    this.ccdNo = this.activatedRoute.snapshot.queryParams['ccdCaseNumber'];
    this.paymentGroupRef = this.activatedRoute.snapshot.queryParams['paymentGroupRef'];
    this.dcnNo = this.activatedRoute.snapshot.queryParams['dcn'];
    this.selectedOption = this.activatedRoute.snapshot.queryParams['selectedOption'];
    this.bulkScanningTxt = this.activatedRoute.snapshot.queryParams['isBulkScanning'] === 'Enable' ?
                                '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
    this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isTurnOff'] === 'Enable' ?
                                '&isTurnOff=Enable' : '&isTurnOff=Disable';
    this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isStFixEnable'] === 'Enable' ?
                                '&isStFixEnable=Enable' : '&isStFixEnable=Disable';
    this.bulkScanningTxt += `&caseType=${this.activatedRoute.snapshot.queryParams['caseType']}`;
    this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isOldPcipalOff'] === 'Enable' ?
                                '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
    this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isNewPcipalOff'] === 'Enable' ?
                                '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';
    this.bulkScanningTxt += this.activatedRoute.snapshot.queryParams['isPaymentStatusEnabled'] === 'Enable' ?
                                '&isPaymentStatusEnabled=Enable' : '&isPaymentStatusEnabled=Disable';

    if (this.lsCcdNumber !== this.ccdNo) {
      this.router.navigateByUrl('/ccd-search?takePayment=true');
    }


    try {
      this.isDiscontinuedFeatureEnabled = await this.paymentGroupService.getDiscontinuedFrFeature();
    } catch (error) {
      this.isDiscontinuedFeatureEnabled = false;
    }
  }

  selectFee(fee: IFee) {
    const selectedFee = this.normaliseFeeForDetails(fee);
    const feeType = selectedFee.fee_type;
    const volAmt = selectedFee.current_version ? selectedFee.current_version['volume_amount'] : selectedFee.fee_versions['volume_amount'];
    const flatAmt = selectedFee.current_version ? selectedFee.current_version['flat_amount'] : selectedFee.fee_versions['flat_amount'];
    const percentageAmt = selectedFee.current_version ? selectedFee.current_version['percentage_amount'] : selectedFee.fee_versions['percentage_amount'];
    let paymentGroup;
    const feeDetailsComponent = new FeeDetailsComponent(null, null);
    const hasFeeVersions = Array.isArray(selectedFee.fee_versions);
    const eligibleOldVersions = this.isDiscontinuedFeatureEnabled
      && hasFeeVersions
      && selectedFee.fee_versions.length > 0
      && feeDetailsComponent.validOldFeesVersions(this.deepClone(selectedFee)).length > 0;

    if ((feeType === 'fixed' && volAmt)
      || (feeType === 'banded' && flatAmt)
      || (feeType === 'rateable' && flatAmt)
      || (feeType === 'ranged' && percentageAmt)
      || eligibleOldVersions) {
      this.preselectedFee = selectedFee;
      this.showFeeDetails = true;
    } else if (selectedFee.current_version === undefined && eligibleOldVersions) {
      this.preselectedFee = selectedFee;
      this.showFeeDetails = true;
    } else if (selectedFee.current_version !== undefined) {
      paymentGroup = {
        fees: [{
          code: selectedFee.code,
          version: selectedFee['current_version'].version.toString(),
          'calculated_amount': selectedFee['current_version'].flat_amount.amount.toString(),
          'memo_line': selectedFee['current_version'].memo_line,
          'natural_account_code': selectedFee['current_version'].natural_account_code,
          'ccd_case_number': this.ccdNo,
          jurisdiction1: selectedFee.jurisdiction1['name'],
          jurisdiction2: selectedFee.jurisdiction2['name'],
          description: selectedFee.current_version.description,
          volume: selectedFee.fee_type === 'relational' ? null : 1,
          fee_amount: selectedFee['current_version'].flat_amount.amount.toString()
        }]
      };
      this.sendPaymentGroup(paymentGroup);
    }
  }

  private normaliseFeeForDetails(fee: IFee): IFee {
    const hasHistoricalVersions = Array.isArray((fee as any).discontinued_list) && (fee as any).discontinued_list.length > 0;
    if (!hasHistoricalVersions) {
      return fee;
    }

    const clone = this.deepClone(fee);
    const currentVersion = clone.current_version ? [clone.current_version] : [];
    const historicalVersions = Array.isArray((clone as any).discontinued_list) ? (clone as any).discontinued_list : [];
    const existingVersions = Array.isArray(clone.fee_versions) ? clone.fee_versions : [];
    const seen = new Set<string>();

    clone.fee_versions = [...existingVersions, ...currentVersion, ...historicalVersions].filter((version: any) => {
      const amount = version && version.flat_amount ? version.flat_amount.amount
        : version && version.volume_amount ? version.volume_amount.amount
          : version && version.percentage_amount ? version.percentage_amount.percentage : '';
      const key = `${version && version.version}|${version && version.valid_from}|${amount}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    return clone;
  }

  private deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
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
    const fee_amount = volAmt ? volAmt.amount : (flatAmt ? flatAmt.amount : null);
    const feeType = fee.fee_type;
    const calculatedAmt = ((feeType === 'rateable' && flatAmt) || (feeType === 'ranged' && percentageAmt))
    ? this.outputEmitterFeesDetails.volumeAmount : (fee_amount * this.outputEmitterFeesDetails.volumeAmount).toString();
    const paymentGroup = {
      fees: [{
        code: fee.code,
        version: selectedFeeVersion.version.toString(),
        'calculated_amount': calculatedAmt,
        'memo_line': selectedFeeVersion.memo_line,
        'natural_account_code': selectedFeeVersion.natural_account_code,
        'ccd_case_number': this.ccdNo,
        jurisdiction1: fee.jurisdiction1['name'],
        jurisdiction2: fee.jurisdiction2['name'],
        description: selectedFeeVersion.description,
        volume: ((feeType === 'rateable' && flatAmt) || (feeType === 'ranged' && percentageAmt))
        ? 1 : this.outputEmitterFeesDetails.volumeAmount,
        fee_amount: fee_amount
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
