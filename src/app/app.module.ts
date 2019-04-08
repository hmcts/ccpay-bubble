import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { AddFeeDetailComponent } from './components/add-fee-detail/add-fee-detail.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';
import { ReviewFeeDetailComponent } from './components/review-fee-detail/review-fee-detail.component';
import { PaybubbleHttpClient } from './services/httpclient/paybubble.http.client';
import { AddFeeDetailService } from './services/add-fee-detail/add-fee-detail.service';
import { FeeListTableComponent } from 'src/app/shared/components/fee-list-table/fee-list-table.component';
import { ConfirmationComponent } from 'src/app/components/confirmation/confirmation.component';
import { FormatDisplayCurrencyPipe } from 'src/app/shared/pipes/format-display-currency.pipe';
import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { ViewPaymentModule } from 'view-payment';

@NgModule({
  declarations: [
    AppComponent,
    AddFeeDetailComponent,
    PhaseBannerComponent,
    ReviewFeeDetailComponent,
    FeeListTableComponent,
    ConfirmationComponent,
    ServiceFailureComponent,
    FormatDisplayCurrencyPipe,
    HeaderComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ViewPaymentModule
  ],
  providers: [
    PaybubbleHttpClient,
    AddFeeDetailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
