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

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot?.queryParams || {};

    this.ccdNo = queryParams['ccdCaseNumber'];
    this.paymentGroupRef = queryParams['paymentGroupRef'];
    this.dcnNo = queryParams['dcn'];
    this.selectedOption = queryParams['selectedOption'];

    this.bulkScanningTxt = '';
    this.bulkScanningTxt += this.buildToggleQuery('isBulkScanning', queryParams['isBulkScanning']);
    this.bulkScanningTxt += this.buildToggleQuery('isTurnOff', queryParams['isTurnOff']);
    this.bulkScanningTxt += this.buildToggleQuery('isStFixEnable', queryParams['isStFixEnable']);
    this.bulkScanningTxt += `&caseType=${queryParams['caseType']}`;
    this.bulkScanningTxt += this.buildToggleQuery('isOldPcipalOff', queryParams['isOldPcipalOff']);
    this.bulkScanningTxt += this.buildToggleQuery('isNewPcipalOff', queryParams['isNewPcipalOff']);
    this.bulkScanningTxt += this.buildToggleQuery('isPaymentStatusEnabled', queryParams['isPaymentStatusEnabled']);

    if (this.lsCcdNumber !== this.ccdNo) {
      this.router.navigateByUrl('/ccd-search?takePayment=true');
    }
    this.loadDiscontinuedFeatureFlag();
  }

  selectFee(fee: IFee) {
    const selectedFee = this.normaliseFeeForDetails(fee);
    const feeType = selectedFee.fee_type;
    const feeVersionSource = selectedFee.current_version || selectedFee.fee_versions;
    const volAmt = feeVersionSource?.['volume_amount'];
    const flatAmt = feeVersionSource?.['flat_amount'];
    const percentageAmt = feeVersionSource?.['percentage_amount'];
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
      const amount = this.getAmountFromVersion(version);
      const key = `${version?.version}|${version?.valid_from}|${amount}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    return clone;
  }

  private deepClone<T>(value: T): T {
    return structuredClone(value);
  }

  private async loadDiscontinuedFeatureFlag(): Promise<void> {
    try {
      this.isDiscontinuedFeatureEnabled = await this.paymentGroupService.getDiscontinuedFrFeature();
    } catch (error) {
      this.isDiscontinuedFeatureEnabled = false;
      // Keep fee search usable even when feature flag retrieval fails.
      console.warn('Failed to load discontinued fee feature flag', error);
    }
  }

  private buildToggleQuery(paramName: string, value: string): string {
    return value === 'Enable' ? `&${paramName}=Enable` : `&${paramName}=Disable`;
  }

  private getAmountFromVersion(version: any): any {
    if (version?.flat_amount) {
      return version.flat_amount.amount;
    }

    if (version?.volume_amount) {
      return version.volume_amount.amount;
    }

    if (version?.percentage_amount) {
      return version.percentage_amount.percentage;
    }

    return '';
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

    const volAmt = selectedFeeVersion?.['volume_amount'];
    const flatAmt = selectedFeeVersion?.['flat_amount'];
    const percentageAmt = selectedFeeVersion?.['percentage_amount'];
    const fee_amount = this.getAmountFromVersion(selectedFeeVersion);
    const feeType = fee.fee_type;
    const isRateableOrRanged = (feeType === 'rateable' && !!flatAmt) || (feeType === 'ranged' && !!percentageAmt);
    const calculatedAmt = isRateableOrRanged
      ? this.outputEmitterFeesDetails.volumeAmount
      : (fee_amount * this.outputEmitterFeesDetails.volumeAmount).toString();
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
        volume: isRateableOrRanged ? 1 : this.outputEmitterFeesDetails.volumeAmount,
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
