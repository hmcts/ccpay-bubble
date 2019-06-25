import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { AddFeeDetailComponent } from './components/add-fee-detail/add-fee-detail.component';
import { ReviewFeeDetailComponent } from './components/review-fee-detail/review-fee-detail.component';
import { FeeSearchComponent } from './components/fee-search/fee-search.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';
import { FeeListTableComponent } from './shared/components/fee-list-table/fee-list-table.component';
import { ServiceFailureComponent } from './shared/components/service-failure/service-failure.component';
import { PaybubbleHttpClient } from './services/httpclient/paybubble.http.client';
import { AddFeeDetailService } from './services/add-fee-detail/add-fee-detail.service';
import { ViewPaymentComponent } from 'src/app/components/view-payment/view-payment.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { FormatDisplayCurrencyPipe } from './shared/pipes/format-display-currency.pipe';
import { HeaderComponent } from './shared/components/header/header.component';
import { SanitizeHtmlPipe } from 'src/app/shared/pipes/sanitize-html.pipe';
import { ViewPaymentModule } from 'view-payment';
import { FeeRegisterSearchModule } from 'fee-register-search';
import { CcdSearchComponent } from './components/ccd-search/ccd-search.component';
import { WindowUtil } from './services/window-util/window-util';
import { FeesSummaryComponent } from './components/fees-summary/fees-summary.component';
import { PaymentGroupService } from './services/payment-group/payment-group.service';

@NgModule({
  declarations: [
    AppComponent,
    AddFeeDetailComponent,
    PhaseBannerComponent,
    ReviewFeeDetailComponent,
    FeeListTableComponent,
    ConfirmationComponent,
    ServiceFailureComponent,
    ViewPaymentComponent,
    FormatDisplayCurrencyPipe,
    SanitizeHtmlPipe,
    HeaderComponent,
    NavigationComponent,
    FeeSearchComponent,
    CcdSearchComponent,
    FeesSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ViewPaymentModule,
    FeeRegisterSearchModule
  ],
  providers: [
    PaybubbleHttpClient,
    AddFeeDetailService,
    PaymentGroupService,
    WindowUtil
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
