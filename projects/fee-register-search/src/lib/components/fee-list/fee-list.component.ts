import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFee } from '../../interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'pay-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.scss']
})
export class FeeListComponent {
  @Input() fees?: IFee[];
  @Input() filterBy?: string;
  @Output() selectedFeeEvent: EventEmitter<IFee> = new EventEmitter();
  paginationPage = 1;

  selectFee(fee: IFee) {
    this.selectedFeeEvent.emit(fee);
  }
}
