import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { FeeModel } from 'src/app/models/FeeModel';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { ReviewFeeDetailRouteGuard } from 'src/app/components/review-fee-detail/route-guards/review-fee-detail.service';

describe('Review fee detail route guard', () => {
  let addFeeDetailService: AddFeeDetailService;
  let router: any;
  let http: PaybubbleHttpClient;
  let reviewFeeDetailRouteGuard: ReviewFeeDetailRouteGuard;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailService = new AddFeeDetailService(http);
    router = { navigate: jasmine.createSpy('navigate')};
    reviewFeeDetailRouteGuard = new ReviewFeeDetailRouteGuard(addFeeDetailService, router);
  });

   it('Should return true when the user has selected a fee', () => {
    const feeModel = new FeeModel();
    feeModel.calculated_amount = 500;
    spyOnProperty(addFeeDetailService, 'selectedFee').and.returnValue(feeModel);
    expect(reviewFeeDetailRouteGuard.canActivate()).toBeTruthy();
  });

  it('Should return false when the user has not selected a fee', () => {

    const feeModel = null;
    spyOnProperty(addFeeDetailService, 'selectedFee').and.returnValue(feeModel);
    expect(reviewFeeDetailRouteGuard.canActivate()).toBeFalsy();
  });

  it('Should redirect to add fee detail route if user has not selected a fee', () => {
    const feeModel = null;
    spyOnProperty(addFeeDetailService, 'selectedFee').and.returnValue(feeModel);
    expect(reviewFeeDetailRouteGuard.canActivate()).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/addFeeDetail']);
  });
});
