import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFee } from '../../interfaces';
import { Jurisdictions } from '../../models/Jurisdictions';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterFeesPipe } from '../../pipes/filter-fees.pipe';

@Component({
    selector: 'pay-fee-list',
    templateUrl: './fee-list.component.html',
    styleUrls: ['./fee-list.component.scss'],
    imports: [NgIf, NgFor, NgxPaginationModule, DecimalPipe, FilterFeesPipe]
})
export class FeeListComponent {
  @Input() fees?: IFee[];
  @Input() searchFilter?: string;
  @Input() jurisdictionsFilter?: Jurisdictions;
  @Output() selectedFeeEvent: EventEmitter<IFee> = new EventEmitter();
  p = 1;

  selectFee(fee: IFee) {
    this.selectedFeeEvent.emit(fee);
  }
  capitalise(str: string): string {
    return str
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
}
