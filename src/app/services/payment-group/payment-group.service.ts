import {Injectable} from '@angular/core';
import {PaybubbleHttpClient} from '../httpclient/paybubble.http.client';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

const BULK_SCANNING_ENABLED = 'bulk-scan-enabling-fe';
const DISCONTINUED_FEES_FEATURE_ENABLED = 'discontinued-fees-feature';


@Injectable()
export class PaymentGroupService {

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
      const bsPaymentGroup = JSON.parse(bsPaymentGroupJson);
      return <any>bsPaymentGroup;
    });
  }
  getBSFeature(): Promise<any> {
    return this.http.get('api/payment-history/bulk-scan-feature').toPromise().then(features => {
      const regFeature = JSON.parse(features).find(feature => feature.uid === BULK_SCANNING_ENABLED);
      return regFeature ? regFeature.enable : false;
    });
  }

   getDiscontinuedFrFeature(): Promise<any> {
      return this.http.get('api/payment-history/bulk-scan-feature').toPromise().then(features => {
        const regFeature = JSON.parse(features).find(feature => feature.uid === DISCONTINUED_FEES_FEATURE_ENABLED);
        return regFeature ? regFeature.enable : false;
      });
    }
}
