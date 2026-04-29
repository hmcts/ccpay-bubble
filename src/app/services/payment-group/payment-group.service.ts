import {Injectable} from '@angular/core';
import {PaybubbleHttpClient} from '../httpclient/paybubble.http.client';
import { BehaviorSubject } from 'rxjs';
import {IPaymentGroup} from '@hmcts/ccpay-web-component';
import { IBSPayments } from '@hmcts/ccpay-web-component';

@Injectable()
export class PaymentGroupService {
  currentEnvironment$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private http: PaybubbleHttpClient
  ) {
  }

  postPaymentGroup(paymentGroup: any): Promise<IPaymentGroup> {
    return this.http.post('api/payment-groups', paymentGroup).toPromise().then(paymentGroupJson => {
      return <IPaymentGroup>paymentGroupJson;
    });
  }

  putPaymentGroup(paymentGroupRef: string, paymentGroup: any): Promise<IPaymentGroup> {
    return this.http.put(`api/payment-groups/${paymentGroupRef}`, paymentGroup).toPromise().then(paymentGroupJson => {
      return <IPaymentGroup>paymentGroupJson;
    });
  }

  getBSPaymentsByDCN(dcn: string): Promise<any> {
    return this.http.get(`api/bulk-scan/cases?document_control_number=${dcn}`).toPromise().then(bsPaymentGroupJson => {
      const bsPaymentGroup = JSON.stringify(bsPaymentGroupJson);
      return bsPaymentGroup;
    });
  }

  getBSFeature(): Promise<any> {
    return Promise.resolve(true);
  }

  getLDFeature(_flagKey): Promise<any> {
    return Promise.resolve(false);
  }

  getTelephonyFeature(): Promise<any> {
    return Promise.resolve(false);
  }

  getDiscontinuedFrFeature(): Promise<any> {
    return Promise.resolve(true);
  }

  getEnvironment(): Promise<any> {
    return this.http.get('api/get-environment').toPromise().then(env => {
      return env;
    });
  }

  getBSPaymentsByCCD(ccdCaseNumber: string): Promise<IBSPayments> {
    return this.http.get(`api/bulk-scan/cases/${ccdCaseNumber}`)
      .toPromise()
      .then(response => {
        return <IBSPayments>JSON.stringify(response);
      });
  }
}
