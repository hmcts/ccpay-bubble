import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { AddFeeDetailComponent } from './components/add-fee-detail/add-fee-detail.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';
import { ReviewFeeDetailComponent } from './components/review-fee-detail/review-fee-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AddFeeDetailComponent,
    PhaseBannerComponent,
    ReviewFeeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
