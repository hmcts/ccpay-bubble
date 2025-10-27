import {Injectable} from '@angular/core';
import {PaybubbleHttpClient} from '../httpclient/paybubble.http.client';
import { Observable, BehaviorSubject } from 'rxjs';
import {IPaymentGroup} from '@hmcts/ccpay-web-component';
import { IBSPayments } from '@hmcts/ccpay-web-component';

const BULK_SCANNING_ENABLED = 'bulk-scan-enabling-fe';
const DISCONTINUED_FEES_FEATURE_ENABLED = 'discontinued-fees-feature';


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
    return this.http.get('api/payment-history/bulk-scan-feature').toPromise().then(features => {
      const regFeature = JSON.parse(features).find(feature => feature.uid === BULK_SCANNING_ENABLED);
      return regFeature ? regFeature.enable : false;
    });
  }

  getLDFeature(flagKey): Promise<any> {
    return this.http.get(`api/payment-history/LD-feature?flag=${flagKey}`).toPromise().then(features => {
      return !JSON.stringify(features);
    });
  }

  getTelephonyFeature(): Promise<any> {
    return this.http.get('api/pci-pal-telephony-selection/feature').toPromise().then(features => {
      const result = JSON.parse(features);
      if (result === null ) {
        return false;
      }
      if (result.flag === true) {
        return result.flag;
      } else {
        return false;
      }
    });
  }

  getDiscontinuedFrFeature(): Promise<any> {
    return this.http.get('api/payment-history/bulk-scan-feature').toPromise().then(features => {
      const regFeature = JSON.parse(features).find(feature => feature.uid === DISCONTINUED_FEES_FEATURE_ENABLED);
      return regFeature ? regFeature.enable : false;
    });
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
