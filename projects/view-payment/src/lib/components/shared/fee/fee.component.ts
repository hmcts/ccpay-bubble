import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IFee } from '../../../interfaces/';

@Component({
  selector: 'ccpay-fee',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './fee.component.html'
})
export class FeeComponent {
  @Input() fee: IFee;
}
