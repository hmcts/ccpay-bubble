import { Component, Input } from '@angular/core';
import { IFee } from '../../../interfaces/';

@Component({
  selector: 'ccpay-fee',
  templateUrl: './fee.component.html'
})
export class FeeComponent {
  @Input() fee: IFee;
}
