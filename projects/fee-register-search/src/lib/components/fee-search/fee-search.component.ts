import { Component, Output, ViewChild, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pay-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent implements OnInit {
  @Output() feeSearchEventEmitter: EventEmitter<string> = new EventEmitter();
  searchForm: FormGroup;
  hasErrors = false;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
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
