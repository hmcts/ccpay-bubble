import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { Router } from '@angular/router';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ConfirmationComponent } from 'src/app/components/confirmation/confirmation.component';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('ReviewFeeDetailComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ConfirmationComponent],
    imports: [RouterModule,
        RouterTestingModule.withRoutes([])],
    providers: [
        PaybubbleHttpClient,
        AddFeeDetailService,
        { provide: Router, useValue: routerMock },
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    const service = fixture.debugElement.injector.get(AddFeeDetailService);
    service.remissionRef = 'HWF-123';
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should GET paymodel', () => {
    expect(component.remissionRef).toEqual('HWF-123');
  });

  it('It should navigate back to the add fee details page', () => {
    component.takeNewPayment();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/addFeeDetail');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
