import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeeDetailComponent } from '../components/add-fee-detail/add-fee-detail.component';
import { ReviewFeeDetailComponent } from '../components/review-fee-detail/review-fee-detail.component';
import { ReviewFeeDetailRouteGuard } from 'src/app/components/review-fee-detail/route-guards/review-fee-detail.service';
import { ConfirmationComponent } from 'src/app/components/confirmation/confirmation.component';
import { ConfirmationGuard } from 'src/app/components/confirmation/route-guards/confirmation-guard.service';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';
import { FeeSearchComponent } from '../components/fee-search/fee-search.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ReviewFeeDetailRouteGuard, ConfirmationGuard]
})
export class AppRoutingModule { }
