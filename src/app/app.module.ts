import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { AddFeeDetailComponent } from './components/add-fee-detail/add-fee-detail.component';
import { PhaseBannerComponent } from './shared/components/phase-banner/phase-banner.component';

@NgModule({
  declarations: [
    AppComponent,
    AddFeeDetailComponent,
    PhaseBannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
