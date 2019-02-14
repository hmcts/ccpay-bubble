import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { ConfirmationGuard } from 'src/app/components/confirmation/route-guards/confirmation-guard.service';

describe('Review fee detail route guard', () => {
  let addFeeDetailService: AddFeeDetailService;
  let router: any;
  let http: PaybubbleHttpClient;
  let confirmationRouteguardComponent: ConfirmationGuard;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailService = new AddFeeDetailService(http);
    router = { navigate: jasmine.createSpy('navigate')};
    confirmationRouteguardComponent = new ConfirmationGuard(router, addFeeDetailService);
  });

  it('Should return true when the user has entered a payment ref', () => {
    spyOnProperty(addFeeDetailService, 'paymentRef').and.returnValue('HWF-123');
    expect(confirmationRouteguardComponent.canActivate()).toBeTruthy();
  });

  it('Should return false when the user has not entered a payment ref', () => {
    spyOnProperty(addFeeDetailService, 'paymentRef').and.returnValue('');
    expect(confirmationRouteguardComponent.canActivate()).toBeFalsy();
  });

  it('Should redirect to add fee detail route if user has not entered a payment ref', () => {
    spyOnProperty(addFeeDetailService, 'paymentRef').and.returnValue('');
    expect(confirmationRouteguardComponent.canActivate()).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/addFeeDetail']);
  });
});
