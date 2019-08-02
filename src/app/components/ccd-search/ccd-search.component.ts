import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ccdCaseRefPatternValidator } from 'src/app/shared/validators/ccd-case-ref-pattern.validator';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccd-search',
  templateUrl: './ccd-search.component.html',
  styleUrls: ['./ccd-search.component.scss']
})
export class CcdSearchComponent implements OnInit {
  searchForm: FormGroup;
  hasErrors = false;
  ccdCaseNumber: string;
  takePayment: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchInput: ['', [Validators.required, ccdCaseRefPatternValidator()]]
    });
    this.takePayment = true;
  }


  searchFees() {
    if (this.searchForm.invalid) { return this.hasErrors = true; }
    this.hasErrors = false;
    this.ccdCaseNumber = this.searchForm.get('searchInput').value;
    const url = this.takePayment ? `?view=case-transactions&takePayment=${this.takePayment}` : '?view=case-transactions';
    this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}${url}`);
  }

  removeHyphenFromString(input: string) {
    const pattern = /\-/gi;
    return input.replace(pattern, '');
  }
}
