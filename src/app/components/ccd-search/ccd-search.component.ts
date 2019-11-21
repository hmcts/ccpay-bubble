import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';

@Component({
  selector: 'app-ccd-search',
  templateUrl: './ccd-search.component.html',
  styleUrls: ['./ccd-search.component.scss']
})
export class CcdSearchComponent implements OnInit {
  searchForm: FormGroup;
  hasErrors = false;
  ccdCaseNumber: string;
  dcnNumber: string;
  takePayment: boolean;
  selectedValue = 'CCDorException';
  ccdPattern =  /^([0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4})?([0-9]{16})?$/i;
  dcnPattern = /^[0-9]{17}$/i;
  noCaseFound = false;
  noCaseFoundInCCD = false;
  isBulkscanningEnable = true;

  constructor(
    private paymentGroupService: PaymentGroupService,
    private formBuilder: FormBuilder,
    private router: Router,
    private caseRefService: CaseRefService
  ) {}

  ngOnInit() {
    this.paymentGroupService.getBSFeature().then((status) => {
      this.isBulkscanningEnable = status;
    });
    this.fromValidation();
   }

  fromValidation() {
      this.searchForm = this.formBuilder.group({
      searchInput: new FormControl('',
       [ Validators.required,
          Validators.pattern(!this.isBulkscanningEnable ?
          this.ccdPattern :
          this.selectedValue === 'CCDorException' ?
          this.ccdPattern : this.dcnPattern)
          ]),
      CCDorException: new FormControl(this.selectedValue) });
  }

  onSelectionChange(value: string) {
      this.selectedValue = value;
      this.hasErrors = false;
      this.noCaseFoundInCCD = false;
      this.searchForm.get('CCDorException').setValue(value);
      this.fromValidation();
    }

  searchFees() {
      if (this.searchForm.controls['searchInput'].valid) {
      this.takePayment = true;
      this.hasErrors = false;
      const searchValue = this.searchForm.get('searchInput').value;
      const bsEnableUrl = this.isBulkscanningEnable ? '&isBulkScanning=Enable' : '&isBulkScanning=Disable';
      if (this.selectedValue.toLocaleLowerCase() === 'dcn') {
        this.paymentGroupService.getBSPaymentsByDCN(searchValue).then((res) => {
          if (res['data'].ccd_reference || res['data'].exception_record_reference) {
            this.dcnNumber = searchValue;
            this.ccdCaseNumber = res['data'].ccd_reference ? res['data'].ccd_reference : res['data'].exception_record_reference;
            // tslint:disable-next-line:max-line-length
            const url = this.takePayment ? `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : '?view=case-transactions';
            this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}${bsEnableUrl}`);
          }
          this.noCaseFound = true;
        }).catch(() => {
          this.noCaseFound = true;
        });

      } else {
        this.ccdCaseNumber = this.removeHyphenFromString(searchValue);
        this.dcnNumber = null;
        this.caseRefService.validateCaseRef(this.ccdCaseNumber).subscribe(resp => {
          this.noCaseFoundInCCD = false;
          // tslint:disable-next-line:max-line-length
          const url = this.takePayment ? `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : '?view=case-transactions';
          this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}${bsEnableUrl}`);
        }, err => {
          this.noCaseFoundInCCD = true;
        });
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
