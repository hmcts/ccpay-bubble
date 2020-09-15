import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-ccd-search',
  templateUrl: './ccd-search.component.html',
  styleUrls: ['./ccd-search.component.scss']
})
export class CcdSearchComponent implements OnInit {
  searchForm: FormGroup;
  hasErrors = false;
  ccdCaseNumber: string;
  excReference: string;
  dcnNumber: string;
  takePayment: boolean;
  selectedValue = 'CCDorException';
  ccdPattern =  /^([0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4})?([0-9]{16})?$/i;
  dcnPattern = /^[0-9]{21}$/i;
  prnPattern = /^([a-z]{2}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4})?([a-z]{2}\[0-9]{16})?$/i;
  noCaseFound = false;
  noCaseFoundInCCD = false;
  isBulkscanningEnable = true;
  isTurnOff: boolean;
  isOldPcipalOff: boolean;
  isNewPcipalOff: boolean;



  constructor(
    private paymentGroupService: PaymentGroupService,
    private formBuilder: FormBuilder,
    private router: Router,
    private caseRefService: CaseRefService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {
      this.takePayment = this.activatedRoute.snapshot.queryParams['takePayment'] === 'false' ? null : true ;
    });
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });
    this.paymentGroupService.getLDFeature('apportion-feature').then((status) => {
      this.isTurnOff = status;
    });
    this.paymentGroupService.getLDFeature('FE-pcipal-old-feature').then((status) => {
      this.isOldPcipalOff = status;
    });
    this.paymentGroupService.getLDFeature('FE-pcipal-antenna-feature').then((status) => {
      this.isNewPcipalOff = status;
    });
    this.fromValidation();
   }

   fromValidation() {
    this.searchForm = this.formBuilder.group({
    searchInput: new FormControl('',
     [ Validators.required,
      Validators.pattern(!this.isBulkscanningEnable ?
        // tslint:disable-next-line:max-line-length
        this.ccdPattern : this.selectedValue === 'CCDorException' ? this.ccdPattern : this.selectedValue === 'DCN' ? this.dcnPattern : this.prnPattern)
    ]),
    CCDorException: new FormControl(this.selectedValue) });
}

  onSelectionChange(value: string) {
      this.selectedValue = value;
      this.hasErrors = false;
      this.noCaseFoundInCCD = false;
      this.noCaseFound = false;
      this.searchForm.get('CCDorException').setValue(value);
      this.fromValidation();
    }

  searchFees() {
      if (this.searchForm.controls['searchInput'].valid) {
      this.hasErrors = false;
      const searchValue = this.searchForm.get('searchInput').value;
      const bsEnableUrl = this.isBulkscanningEnable ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      const turnOffUrl = this.isTurnOff ? '&isTurnOff=Enable' : '&isTurnOff=Disable';
      const isOldPcipalOff = this.isOldPcipalOff ? '&isOldPcipalOff=Enable' : '&isOldPcipalOff=Disable';
      const isNewPcipalOff = this.isNewPcipalOff ? '&isNewPcipalOff=Enable' : '&isNewPcipalOff=Disable';

      if (this.selectedValue.toLocaleLowerCase() === 'dcn') {
        this.paymentGroupService.getBSPaymentsByDCN(searchValue).then((res) => {
          if (res['data'].ccd_reference || res['data'].exception_record_reference) {
            this.dcnNumber = searchValue;
            if (res['data'].ccd_reference !== undefined && res['data'].ccd_reference.length > 0) {
              this.ccdCaseNumber = res['data'].ccd_reference ;
              this.excReference = '';
            } else if (res['data'].exception_record_reference !== undefined && res['data'].exception_record_reference.length > 0) {
              this.excReference = res['data'].exception_record_reference ;
              this.ccdCaseNumber = '';
            }
            // tslint:disable-next-line:max-line-length
            const url = this.takePayment ? `?selectedOption=${this.selectedValue}&exceptionRecord=${this.excReference}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions`;
            // tslint:disable-next-line:max-line-length
            this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}${bsEnableUrl}${turnOffUrl}${isOldPcipalOff}${isNewPcipalOff}`);
          }
          this.noCaseFound = true;
        }).catch(() => {
          this.noCaseFound = true;
        });

      } else if (this.selectedValue.toLocaleLowerCase() === 'ccdorexception') {
        this.ccdCaseNumber = this.removeHyphenFromString(searchValue);
        this.dcnNumber = null;
        this.caseRefService.validateCaseRef(this.ccdCaseNumber).subscribe(resp => {
          this.noCaseFoundInCCD = false;
          // tslint:disable-next-line:max-line-length
          const url = this.takePayment ? `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions`;
          // tslint:disable-next-line:max-line-length
          this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}${bsEnableUrl}${turnOffUrl}${isOldPcipalOff}${isNewPcipalOff}`);
        }, err => {
          this.noCaseFoundInCCD = true;
        });
      } else  {
      return this.hasErrors = true;
    }
  } else {
    return this.hasErrors = true;
  }
}

  removeHyphenFromString(input: string) {
    const pattern = /\-/gi;
    return input.replace(pattern, '');
  }
}
