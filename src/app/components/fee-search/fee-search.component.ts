import { Component } from '@angular/core';

@Component({
  selector: 'app-fee-search',
  templateUrl: './fee-search.component.html',
  styleUrls: ['./fee-search.component.scss']
})
export class FeeSearchComponent {
  selectedFee: any;

  logFee(fee: any) {
    this.selectedFee = fee;
    console.log(fee);
  }
}
