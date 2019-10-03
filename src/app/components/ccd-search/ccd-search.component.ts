import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getTypeNameForDebugging } from '@angular/core/src/change_detection/differs/iterable_differs';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
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
  ccdPattern =  /^[0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}$/i;
  dcnPattern = /^[0-9]{17}$/i;
  noCaseFound = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentGroupService: PaymentGroupService,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: PaybubbleHttpClient,
    private caseRefService: CaseRefService
  ) {}

  ngOnInit() {
      this.fromValidation();
     }

  fromValidation() {
      this.searchForm = this.formBuilder.group({
      searchInput: new FormControl('', [ Validators.required,
                                     Validators.pattern(this.selectedValue === 'CCDorException' ? this.ccdPattern : this.dcnPattern)]),
      CCDorException: new FormControl(this.selectedValue) });
  }

  onSelectionChange(value: string) {
      this.selectedValue = value;
      this.hasErrors = false;
      this.searchForm.get('CCDorException').setValue(value);
      this.fromValidation();
    }


  searchFees() {
      if (this.searchForm.controls['searchInput'].valid) {
      this.takePayment = true;
      this.hasErrors = false;
      const searchValue = this.searchForm.get('searchInput').value;
      if (this.selectedValue.toLocaleLowerCase() === 'dcn') {
        this.paymentGroupService.getBSPaymentsByDCN(searchValue).then((res) => {
          this.dcnNumber = searchValue;
          this.ccdCaseNumber = res['data'].ccd_reference ? res['data'].ccd_reference : res['data'].exception_record_reference;
          // tslint:disable-next-line:max-line-length
          const url = this.takePayment ? `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : '?view=case-transactions';
          this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}`);
        }).catch(() => {
          this.noCaseFound = true;
        });

      } else {
        this.ccdCaseNumber = this.removeHyphenFromString(searchValue);
        this.dcnNumber = null;
        // tslint:disable-next-line:max-line-length
        const url = this.takePayment ? `?selectedOption=${this.selectedValue}&dcn=${this.dcnNumber}&view=case-transactions&takePayment=${this.takePayment}` : '?view=case-transactions';
        this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}`);
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
