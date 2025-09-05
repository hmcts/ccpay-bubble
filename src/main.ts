
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { PaybubbleHttpClient } from './app/services/httpclient/paybubble.http.client';
import { AddFeeDetailService } from './app/services/add-fee-detail/add-fee-detail.service';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CaseRefService } from './app/services/caseref/caseref.service';
import { IdamDetails } from './app/services/idam-details/idam-details';
import { WindowUtil } from './app/services/window-util/window-util';
import { AuthDevInterceptor } from './app/shared/interceptors/auth.dev.interceptor';
import { PaymentGroupService } from './app/services/payment-group/payment-group.service';
import { ViewPaymentService } from 'projects/view-payment/src/lib/view-payment.service';
import { windowToken, windowProvider } from './window';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/routes/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPaymentModule } from 'view-payment';
import { FeeRegisterSearchModule } from 'fee-register-search';
import { PaymentLibModule } from '@hmcts/ccpay-web-component';
import { provideNoopAnimations, provideAnimations } from '@angular/platform-browser/animations';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { AppComponent } from './app/app.component';

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
        importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, ViewPaymentModule, FeeRegisterSearchModule, PaymentLibModule, RpxTranslationModule.forRoot({
            baseUrl: '/api/translation',
            debounceTimeMs: 300,
            validity: {
                days: 1
            },
            testMode: false
        })),
        PaybubbleHttpClient,
        AddFeeDetailService,
        CaseRefService,
        IdamDetails,
        WindowUtil,
        !environment.production ? nonProductionProviders : [],
        PaymentGroupService,
        ViewPaymentService,
        { provide: windowToken, useFactory: windowProvider },
        provideHttpClient(withInterceptorsFromDi()),
        provideNoopAnimations(),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
