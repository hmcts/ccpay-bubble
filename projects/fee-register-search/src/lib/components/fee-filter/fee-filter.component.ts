import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pay-fee-filter',
  templateUrl: './fee-filter.component.html',
  styleUrls: ['./fee-filter.component.scss']
})
export class FeeFilterComponent implements OnInit {

  @Output() jurisdictionFilterEvent: EventEmitter<string[]> = new EventEmitter();
  filterForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      civil: ['', []],
      family: ['', []],
      tribunal: ['', []]
    });
  }

  applyFilter() {
    const emitValue: string[] = [];
    if ( this.filterForm.get('civil').value) {
      emitValue.push('civil');
    }
    if ( this.filterForm.get('family').value) {
      emitValue.push('family');
    }
    if ( this.filterForm.get('tribunal').value) {
      emitValue.push('tribunal');
    }
    this.jurisdictionFilterEvent.emit(emitValue);
  }
}
