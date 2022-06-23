import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';

import {AppRoutingModule} from './routes/app-routing.module';
import {AppComponent} from './app.component';
import {ReviewFeeDetailComponent} from './components/review-fee-detail/review-fee-detail.component';
import {FeeSearchComponent} from './components/fee-search/fee-search.component';
import {ConfirmationComponent} from './components/confirmation/confirmation.component';
import {PhaseBannerComponent} from './shared/components/phase-banner/phase-banner.component';
import {FeeListTableComponent} from './shared/components/fee-list-table/fee-list-table.component';
import {ServiceFailureComponent} from './shared/components/service-failure/service-failure.component';
import {PaybubbleHttpClient} from './services/httpclient/paybubble.http.client';
import {AddFeeDetailService} from './services/add-fee-detail/add-fee-detail.service';
import {PaymentGroupService} from './services/payment-group/payment-group.service';
import {FeeDetailsComponent} from './components/fee-details/fee-details.component';
import {ViewPaymentComponent} from 'src/app/components/view-payment/view-payment.component';
import {NavigationComponent} from './shared/components/navigation/navigation.component';
import {FormatDisplayCurrencyPipe} from './shared/pipes/format-display-currency.pipe';
import {HeaderComponent} from './shared/components/header/header.component';
import {SanitizeHtmlPipe} from 'src/app/shared/pipes/sanitize-html.pipe';
import {ViewPaymentModule} from 'view-payment';
import {FeeRegisterSearchModule} from 'fee-register-search';
import {PaymentHistoryComponent} from './components/payment-history/payment-history.component';
import {PaymentLibModule} from '@hmcts/ccpay-web-component';
import {WindowUtil} from './services/window-util/window-util';
import {CcdSearchComponent} from './components/ccd-search/ccd-search.component';
import {AuthDevInterceptor} from './shared/interceptors/auth.dev.interceptor';
import {environment} from '../environments/environment';
import { CaseRefService } from './services/caseref/caseref.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { IdamDetails } from './services/idam-details/idam-details';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { CookieService } from './services/cookie/cookie.service';
import { GoogleTagManagerService } from './services/google-tag-manager/google-tag-manager.service';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { windowProvider, windowToken } from './window';

const nonProductionProviders = [{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthDevInterceptor,
  multi: true
}];

@NgModule({
  declarations: [
    AppComponent,
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
    PaymentHistoryComponent,
    FeeSearchComponent,
    CcdSearchComponent,
    FeeDetailsComponent,
    CookieBannerComponent,
    CookiePolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ViewPaymentModule,
    FeeRegisterSearchModule,
    PaymentLibModule,
    NoopAnimationsModule,
    BrowserAnimationsModule
  ],
  providers: [
    PaybubbleHttpClient,
    AddFeeDetailService,
    HttpClient,
    FeeSearchComponent,
    PaymentHistoryComponent,
    CaseRefService,
    IdamDetails,
    WindowUtil,
    !environment.production ? nonProductionProviders : [],
    PaymentGroupService,
    ViewPaymentService,
    CookieService,
    GoogleTagManagerService,
    { provide: windowToken, useFactory: windowProvider }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
