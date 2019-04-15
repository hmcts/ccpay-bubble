import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pay-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent {
  @Output() searchFeesEventEmitter: EventEmitter<boolean> = new EventEmitter();

  showFees() {
    this.searchFeesEventEmitter.emit(true);
  }
}
