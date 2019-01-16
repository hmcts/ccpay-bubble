import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeeDetailComponent } from '../components/add-fee-detail/add-fee-detail.component';

const routes: Routes = [
  { path: 'addFeeDetail',
    component: AddFeeDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
