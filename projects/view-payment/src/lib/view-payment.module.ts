import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPaymentComponent } from './view-payment.component';
import { SinglePaymentViewComponent } from './components/single-payment-view/single-payment-view.component';
import { FeeComponent } from './components/shared/fee/fee.component';
import { StatusHistoryComponent } from './components/shared/status-history/status-history.component';

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
