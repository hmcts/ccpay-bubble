import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPaymentComponent } from './view-payment.component';
import { SinglePaymentViewComponent, FeeComponent, StatusHistoryComponent } from './components';

@NgModule({
  declarations: [
    ViewPaymentComponent,
    SinglePaymentViewComponent,
    FeeComponent,
    StatusHistoryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ViewPaymentComponent]
})
export class ViewPaymentModule { }
