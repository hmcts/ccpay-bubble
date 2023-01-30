import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPaymentComponent } from './view-payment.component';
import { SinglePaymentViewComponent } from './components/single-payment-view/single-payment-view.component';
import { FeeComponent } from './components/shared/fee/fee.component';
import { StatusHistoryComponent } from './components/shared/status-history/status-history.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@NgModule({
  declarations: [
    ViewPaymentComponent,
    SinglePaymentViewComponent,
    FeeComponent,
    StatusHistoryComponent
  ],
  imports: [
    CommonModule,
    BrowserDynamicTestingModule
  ],
  exports: [ViewPaymentComponent]
})
export class ViewPaymentModule { }
