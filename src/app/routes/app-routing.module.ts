import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeeDetailComponent } from '../components/add-fee-detail/add-fee-detail.component';
import { ReviewFeeDetailComponent } from '../components/review-fee-detail/review-fee-detail.component';

const routes: Routes = [
  { path: 'addFeeDetail',
    component: AddFeeDetailComponent
  },
  { path: '',
    pathMatch: 'full',
    redirectTo: 'addFeeDetail'
  },
  { path: 'reviewFeeDetail',
    component: ReviewFeeDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
