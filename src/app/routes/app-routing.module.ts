import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewFeeDetailComponent } from '../components/review-fee-detail/review-fee-detail.component';
import { ReviewFeeDetailRouteGuard } from 'src/app/components/review-fee-detail/route-guards/review-fee-detail.service';
import { ConfirmationComponent } from 'src/app/components/confirmation/confirmation.component';
import { ConfirmationGuard } from 'src/app/components/confirmation/route-guards/confirmation-guard.service';
import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';
import { ViewPaymentComponent } from '../components/view-payment/view-payment.component';
import { FeeSearchComponent } from '../components/fee-search/fee-search.component';
import { PaymentHistoryComponent } from '../components/payment-history/payment-history.component';
import { CcdSearchComponent } from '../components/ccd-search/ccd-search.component';
import { MVPGuard } from '../route-guards/mvp-guard.service';
import { CookiePolicyComponent } from '../components/cookie-policy/cookie-policy.component';
import { CookieDetailsComponent } from '../components/cookie-details/cookie-details.component';

const routes: Routes = [
  {
    path: 'reviewFeeDetail',
    component: ReviewFeeDetailComponent,
    canActivate: [ReviewFeeDetailRouteGuard],
    data: { title: 'Review Fee Detail' },
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    canActivate: [ConfirmationGuard],
    data: { title: 'Confirmation' },
  },
  {
    path: 'payments/:ref',
    component: ViewPaymentComponent,
    data: { title: 'Payments' },
  },
  {
    path: 'service-failure',
    component: ServiceFailureComponent,
    data: { title: 'Service Failure' },
  },
  {
    path: 'fee-search',
    component: FeeSearchComponent,
    data: { title: 'Fee Search' },
  },
  {
    path: 'ccd-search',
    component: CcdSearchComponent,
    data: { title: 'CCD Search' },
  },
  {
    path: 'payment-history/view/:view',
    component: PaymentHistoryComponent,
    data: { title: 'Case Transactions' },
  },
    {
    path: 'payment-history',
    component: CcdSearchComponent,
    data: { title: 'Case Transactions' },
  },
  {
    path: 'service-requests',
    component: CcdSearchComponent,
    data: { title: 'Service Requests' },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ccd-search',
    data: { title: '' },
  },
  {
    path: 'refund-list',
    component: PaymentHistoryComponent,
    data: { title: 'Refund List' },
  },
  {
    path: 'payment-history/:ccdCaseNumber',
    component: PaymentHistoryComponent,
    data: { title: 'Case Transactions' },
  },
  {
    path: 'cookies',
    component: CookiePolicyComponent,
    data: { title: 'Cookies' },
  },
  {
    path: 'cookies-policy',
    component: CookieDetailsComponent,
    data: { title: 'Cookies Policy' },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ReviewFeeDetailRouteGuard, ConfirmationGuard, MVPGuard]
})
export class AppRoutingModule { }
