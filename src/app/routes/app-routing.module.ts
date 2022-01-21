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

const routes: Routes = [
  {
    path: 'reviewFeeDetail',
    component: ReviewFeeDetailComponent,
    canActivate: [ReviewFeeDetailRouteGuard]
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    canActivate: [ConfirmationGuard]
  },
  {
    path: 'payments/:ref',
    component: ViewPaymentComponent
  },
  {
    path: 'service-failure',
    component: ServiceFailureComponent
  },
  {
    path: 'fee-search',
    component: FeeSearchComponent
  },
  {
    path: 'ccd-search',
    component: CcdSearchComponent
  },
  {
    path: 'payment-history/view/:view',
    component: PaymentHistoryComponent
  },
    {
    path: 'payment-history',
    component: CcdSearchComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ccd-search'
  },
  {
    path: 'payment-history/:ccdCaseNumber',
    component: PaymentHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ReviewFeeDetailRouteGuard, ConfirmationGuard, MVPGuard]
})
export class AppRoutingModule { }
