import { Component, Output, ViewChild, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FeeRegisterSearchComponent} from '../../fee-register-search.component';

@Component({
  selector: 'pay-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  @Output() feeSearchEventEmitter: EventEmitter<string> = new EventEmitter();
  searchForm: FormGroup;
  hasErrors = false;
  ccdCaseNumber: string;

  constructor(
    private formBuilder: FormBuilder,
    private feeRegisterSearchComponent: FeeRegisterSearchComponent
  ) {}

  ngOnInit() {
    this.ccdCaseNumber = this.feeRegisterSearchComponent.CCD_CASE_NUMBER;
    this.searchForm = this.formBuilder.group({
      searchInput: ['', [Validators.required]]
    });
  }

  searchFees() {
    if (this.searchForm.invalid) { return this.hasErrors = true; }
    this.hasErrors = false;
    this.feeSearchEventEmitter.emit(this.searchForm.get('searchInput').value);
  }
}
