import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeRegisterSearchComponent } from './fee-register-search.component';
import { FeeRegisterSearchService } from './fee-register-search.service';
import { FeeListComponent } from './components/fee-list/fee-list.component';
import { FeeSearchComponent } from './components/fee-search/fee-search.component';

@NgModule({
  declarations: [
    FeeRegisterSearchComponent,
    FeeListComponent,
    FeeSearchComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [FeeRegisterSearchService],
  exports: [FeeRegisterSearchComponent]
})
export class FeeRegisterSearchModule { }
