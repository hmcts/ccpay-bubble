import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeeDetailComponent } from '../components/add-fee-detail/add-fee-detail.component';
import { ReviewFeeDetailComponent } from '../components/review-fee-detail/review-fee-detail.component';
import { ReviewFeeDetailRouteGuard } from 'src/app/components/review-fee-detail/route-guards/review-fee-detail.service';

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
    path: '',
    pathMatch: 'full',
    redirectTo: 'addFeeDetail'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ReviewFeeDetailRouteGuard]
})
export class AppRoutingModule { }
