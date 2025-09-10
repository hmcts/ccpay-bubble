import { Component, Input } from '@angular/core';
import { IFee } from '../../../interfaces/';
import { NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'ccpay-fee',
  standalone: true,
  templateUrl: './fee.component.html',
  imports: [NgIf, DecimalPipe]
})
export class FeeComponent {
  @Input() fee: IFee;
}
