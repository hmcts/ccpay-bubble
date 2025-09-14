
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/routes/app-routing.module';
// Removed ViewPaymentModule and FeeRegisterSearchModule imports - using standalone components
import { PaymentLibComponent } from '@hmcts/ccpay-web-component';
import { forwardRef } from '@angular/core';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { environment } from './environments/environment';

// Services
import { PaybubbleHttpClient } from './app/services/httpclient/paybubble.http.client';
import { AddFeeDetailService } from './app/services/add-fee-detail/add-fee-detail.service';
import { CaseRefService } from './app/services/caseref/caseref.service';
import { IdamDetails } from './app/services/idam-details/idam-details';
import { WindowUtil } from './app/services/window-util/window-util';
import { PaymentGroupService } from './app/services/payment-group/payment-group.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { windowProvider, windowToken } from './window';
import { AuthDevInterceptor } from './app/shared/interceptors/auth.dev.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const nonProductionProviders = [{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthDevInterceptor,
  multi: true
}];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      RpxTranslationModule.forRoot({
        baseUrl: '/api/translation',
        debounceTimeMs: 300,
        validity: {
          days: 1
        },
        testMode: false
      })
    ),
    PaybubbleHttpClient,
    AddFeeDetailService,
    CaseRefService,
    IdamDetails,
    WindowUtil,
    ...(!environment.production ? nonProductionProviders : []),
    PaymentGroupService,
    ViewPaymentService,
    { provide: windowToken, useFactory: windowProvider },
    { provide: 'PAYMENT_LIB', useExisting: forwardRef(() => PaymentLibComponent) },
    { provide: 'PAYMENT_VIEW', useExisting: forwardRef(() => PaymentLibComponent) },
    { provide: 'ADD_REMISSION', useExisting: forwardRef(() => PaymentLibComponent) },
    { provide: 'SERVICE_REQUEST', useExisting: forwardRef(() => PaymentLibComponent) },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
