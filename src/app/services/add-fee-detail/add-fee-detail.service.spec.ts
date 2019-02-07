import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { Meta } from '@angular/platform-browser';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { of } from 'rxjs';
import { PaymentModel } from 'src/app/models/PaymentModel';


describe('Add fee detail service', () => {
  let addFeeDetailService: AddFeeDetailService;
  let http: PaybubbleHttpClient;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    addFeeDetailService = new AddFeeDetailService(http);
  });

  it('Should call post with correct path', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: PaymentModel) => of(param1));
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    addFeeDetailService.sendPayDetailsToPayhub(paymentModel)
    .subscribe((response) => expect(response).toEqual('/api/send-to-payhub'));
  });

  it('Should call post with a paymentModel', () => {
    const calledWithParams = [];
    spyOn(http, 'post').and.callFake((param1: string, param2: PaymentModel) => of(param2));
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    addFeeDetailService.sendPayDetailsToPayhub(paymentModel)
    .subscribe((response) => expect(response.amount).toBe(100));
  });
});
