import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { FeeRegisterSearchService } from './services/fee-register-search/fee-register-search.service';
import { IFee } from './interfaces';
import { Jurisdictions } from './models/Jurisdictions';

@Component({
  selector: 'pay-fee-register-search',
  templateUrl: './fee-register-search.component.html'
})
export class FeeRegisterSearchComponent implements OnInit {
  @Input() APIRoot;
  @Output() selectedFeeEvent: EventEmitter<IFee> = new EventEmitter();
  fees: IFee[];
  error: string;
  searchFilter: string;
  isResultsDisplayed: boolean;
  jurisdictionsFilter: Jurisdictions;

  constructor(
    private feeRegisterSearchService: FeeRegisterSearchService
  ) { }

  ngOnInit() {
    this.isResultsDisplayed = false;
    this.feeRegisterSearchService.setURL(this.APIRoot);

    this.feeRegisterSearchService.getFees()
      .subscribe(
        (fees: IFee[]) => this.fees = fees,
        (error: string) => this.error = error
    );
  }

  selectFee(fee: IFee) {
    this.selectedFeeEvent.emit(fee);
  }

  setFilters(filter: string) {
    this.isResultsDisplayed = true;
    this.searchFilter = filter;
  }

  setJurisdictionFilter(jurisdictions: Jurisdictions) {
    this.jurisdictionsFilter = jurisdictions;
  }
}
