import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeeDetailComponent } from '../components/add-fee-detail/add-fee-detail.component';
import { ReviewFeeDetailComponent } from '../components/review-fee-detail/review-fee-detail.component';
import { ReviewFeeDetailRouteGuard } from 'src/app/components/review-fee-detail/route-guards/review-fee-detail.service';
import { ConfirmationComponent } from 'src/app/components/confirmation/confirmation.component';
import { ConfirmationGuard } from 'src/app/components/confirmation/route-guards/confirmation-guard.service';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';
import { ViewPaymentComponent } from '../components/view-payment/view-payment.component';
import { FeeSearchComponent } from '../components/fee-search/fee-search.component';
import {PaymentDetailsComponent} from '../components/payment-details/payment-details.component';
import {CaseSearchComponent} from "../components/case-search/case-search.component";

const routes: Routes = [
  {
    path: 'addFeeDetail',
    component: AddFeeDetailComponent
  },
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
    path: '',
    pathMatch: 'full',
    redirectTo: 'addFeeDetail'
  },
  {
    path: 'payment-details',
    component: PaymentDetailsComponent
  },
  {
    path: 'case-search',
    component: CaseSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ReviewFeeDetailRouteGuard, ConfirmationGuard]
})
export class AppRoutingModule { }
