import { Component, Input } from '@angular/core';
import { IFee } from '../../../interfaces/';

@Component({
  selector: 'ccpay-fee',
  standalone: false,
  templateUrl: './fee.component.html'
})
export class FeeComponent {
  @Input() fee: IFee;
}
