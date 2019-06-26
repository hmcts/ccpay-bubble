import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeeRegisterSearchComponent } from './fee-register-search.component';
import { FeeRegisterSearchService } from './services/fee-register-search/fee-register-search.service';
import { FeeListComponent } from './components/fee-list/fee-list.component';
import { FeeSearchComponent } from './components/fee-search/fee-search.component';
import { FilterFeesPipe } from './pipes/filter-fees.pipe';
import { FeeFilterComponent } from './components/fee-filter/fee-filter.component';
import { FeeSummaryComponent } from './components/fee-summary/fee-summary.component';
import { PaymentGroupService } from './services/payment-group/payment-group.service';

@NgModule({
  declarations: [
    FeeRegisterSearchComponent,
    FeeListComponent,
    FeeSearchComponent,
    FeeFilterComponent,
    FilterFeesPipe,
    FeeSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [FeeRegisterSearchService, PaymentGroupService],
  exports: [FeeRegisterSearchComponent, FeeSummaryComponent]
})
export class FeeRegisterSearchModule { }
