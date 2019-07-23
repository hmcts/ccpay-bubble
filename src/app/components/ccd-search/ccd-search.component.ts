import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ccdCaseRefPatternValidator } from 'src/app/shared/validators/ccd-case-ref-pattern.validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { CaseRefService } from '../../services/caseref/caseref.service';

@Component({
  selector: 'app-ccd-search',
  templateUrl: './ccd-search.component.html',
  styleUrls: ['./ccd-search.component.scss']
})
export class CcdSearchComponent implements OnInit {
  searchForm: FormGroup;
  hasErrors = false;
  ccdCaseNumber: string;
  noCaseFound = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: PaybubbleHttpClient,
    private caseRefService: CaseRefService
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchInput: ['', [Validators.required, ccdCaseRefPatternValidator()]]
    });
  }

  searchFees() {
    if (this.searchForm.invalid) { return this.hasErrors = true; }
    this.hasErrors = false;
    this.ccdCaseNumber = this.searchForm.get('searchInput').value;
    this.caseRefService.validateCaseRef(this.ccdCaseNumber).subscribe(resp => {
      this.noCaseFound = false;
      this.router.navigateByUrl(`/payment-history/${this.ccdCaseNumber}?view=case-transactions&takePayment=true`);
    }, err => {
      this.noCaseFound = true;
    });
  }
}
