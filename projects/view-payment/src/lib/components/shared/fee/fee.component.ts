import { Component, Input } from '@angular/core';
import { IFee } from '../../../interfaces/';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'ccpay-fee',
    templateUrl: './fee.component.html',
    imports: [DecimalPipe]
})
export class FeeComponent {
  @Input() fee: IFee;
}
