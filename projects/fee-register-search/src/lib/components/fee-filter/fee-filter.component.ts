import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Jurisdictions } from '../../models/Jurisdictions';
import { FeeRegisterSearchService } from '../../services/fee-register-search/fee-register-search.service';

@Component({
  selector: 'pay-fee-filter',
  templateUrl: './fee-filter.component.html',
  styleUrls: ['./fee-filter.component.scss']
})
export class FeeFilterComponent implements OnInit {

  jurisdictionData = {
    jurisdiction1 : {
      show: false,
      data: null
    },
    jurisdiction2 : {
      show: false,
      data: null
    }
  };

  @Output() jurisdictionsFilterEvent: EventEmitter<Jurisdictions> = new EventEmitter();
  filterForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private feeRegisterSearchService: FeeRegisterSearchService
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      jurisdiction1: ['', []],
      jurisdiction2: ['', []],

    });

    this.feeRegisterSearchService.getJurisdiction(1).subscribe(result => {
      this.jurisdictionData.jurisdiction1.data = result;
    });

    this.feeRegisterSearchService.getJurisdiction(2).subscribe(result => {
      this.jurisdictionData.jurisdiction2.data = result;
    });
  }

  applyFilter() {
    const emitValue: Jurisdictions = new Jurisdictions();
    emitValue.jurisdiction1 = this.filterForm.get('jurisdiction1').value;
    emitValue.jurisdiction2 = this.filterForm.get('jurisdiction2').value;
    this.jurisdictionsFilterEvent.emit(emitValue);
  }

  clearFilter(jurisdiction: string) {
    this.filterForm.get(jurisdiction).reset();
    this.filterForm.get(jurisdiction).setValue('');
  }

  toggleJurisdiction(jurisdiction) {
    jurisdiction.show = !jurisdiction.show;
  }

  formatJurisdictionId(jurisdiction: string) {
    return jurisdiction.split(' ').join('_');
  }
}
