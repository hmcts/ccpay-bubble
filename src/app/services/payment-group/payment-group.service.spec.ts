import {PaybubbleHttpClient} from 'src/app/services/httpclient/paybubble.http.client';
import {Meta} from '@angular/platform-browser';
import {instance, mock} from 'ts-mockito/lib/ts-mockito';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {PaymentModel} from 'src/app/models/PaymentModel';
import {PaymentGroupService} from './payment-group.service';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';

const DISCONTINUED_FEES_FEATURE_ENABLED = 'discontinued-fees-feature';
const BULK_SCANNING_ENABLED = 'bulk-scan-enabling-fe';

describe('Payment group service', () => {
  let paymentGroupService: PaymentGroupService;
  let http: PaybubbleHttpClient;
  beforeEach(() => {
    http = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    paymentGroupService = new PaymentGroupService(http);
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.amount = 100;
    expect(paymentModel.amount).toBe(100);
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.ccd_case_number = '1111222233334444';
    expect(paymentModel.ccd_case_number).toBe('1111222233334444');
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.currency = 'GBP';
    expect(paymentModel.currency).toBe('GBP');
  });

  it('Should SET and GET private payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.description = 'test';
    expect(paymentModel.description).toBe('test');
  });

  it('Should call post full remission with a remissionModel', () => {
    const paymentGroup = <IPaymentGroup>{
        payment_group_reference: '1234',
        fees: [{code: 'FEE0001'}],
        payments: null,
        remissions: null
    };
    spyOn(http, 'post').and.callFake((param1: string, param2: IPaymentGroup) => of(paymentGroup));
    const inputPaymentGroup = <IPaymentGroup>{
      payment_group_reference: null,
      fees: [{ccd_case_number: '1234', code: 'FEE0001'}],
      payments: null,
      remissions: null
    };
    paymentGroupService.postPaymentGroup(inputPaymentGroup)
      .then((response) => {
        expect(response.fees[0].code).toBe(paymentGroup.fees[0].code);
        expect(response.payment_group_reference).toBe(paymentGroup.payment_group_reference);
      });
  });

  it('Should call put Payment Group', () => {
    const paymentGroup = <IPaymentGroup>{
        payment_group_reference: '1234',
        fees: [{code: 'FEE0001'}],
        payments: null,
        remissions: null
    };
    spyOn(http, 'put').and.callFake((param1: string, param2: IPaymentGroup) => of(paymentGroup));
    const inputPaymentGroup = <IPaymentGroup>{
      payment_group_reference: null,
      fees: [{ccd_case_number: '1234', code: 'FEE0001'}],
      payments: null,
      remissions: null
    };
    paymentGroupService.putPaymentGroup('1234', inputPaymentGroup)
      .then((response) => {
        expect(response.fees[0].code).toBe(paymentGroup.fees[0].code);
        expect(response.payment_group_reference).toBe(paymentGroup.payment_group_reference);
      });
  });

  it('Should call get discontinued fees feature is on', () => {
    const features = <any>[
      {
        uid: 'discontinued-fees-feature',
        enable: true,
        description: 'To enable discontinued fees FeesRegister Feature',
        group: null,
        permissions: [],
        flippingStrategy: null,
        customProperties: {}
      }
    ];
    spyOn(features, 'find').and.returnValue(features[0]);
    spyOn(http, 'get').and.callFake(() => of(features));
    http.get('api/payment-history/bulk-scan-feature').subscribe(response => {
      const regFeature = JSON.parse(response).find(feature => feature.uid === DISCONTINUED_FEES_FEATURE_ENABLED),
       result = regFeature ? regFeature.enable : false;
      expect(result).toBe(true);
      expect(response[0].get('uid')).toBe('discontinued-fees-feature');
    });
    paymentGroupService.getDiscontinuedFrFeature()
      .then((response) => {
        expect(response).toBe(true);
      });
  });

  it('Should call get discontinued fees feature is off', () => {
    const features = <any>[
      {
        uid: 'discontinued-fees-feature',
        enable: false,
        description: 'To enable discontinued fees FeesRegister Feature',
        group: null,
        permissions: [],
        flippingStrategy: null,
        customProperties: {}
      }
    ];
    spyOn(features, 'find').and.returnValue(features[0]);
    spyOn(http, 'get').and.callFake(() => of(features));
    http.get('api/payment-history/bulk-scan-feature').subscribe(response => {
      const regFeature = JSON.parse(response).find(feature => feature.uid === DISCONTINUED_FEES_FEATURE_ENABLED),
       result = regFeature ? regFeature.enable : false;
      expect(result).toBe(false);
      expect(response[0].get('uid')).toBe('discontinued-fees-feature');
    });
    paymentGroupService.getDiscontinuedFrFeature()
      .then((response) => {
        expect(response).toBe(false);
      });
  });

  it('Should call get LD feature on flow', () => {
    const feature = <any>{
      flag: true
    };
    spyOn(http, 'get').and.callFake(() => of(feature));
    http.get('api/payment-history/LD-feature?flag=test').subscribe(response => {
      const regFeature = !JSON.parse(response).flag;
      expect(regFeature).toBe(false);
    });
    paymentGroupService.getLDFeature('test')
      .then((response) => {
        expect(response).toBe(false);
      });
  });

  it('Should call get LD feature off flow', () => {
    const feature = <any>{
      flag: false
    };
    spyOn(http, 'get').and.callFake(() => of(feature));
    http.get('api/payment-history/LD-feature?flag=test').subscribe(response => {
      const regFeature = !JSON.parse(response).flag;
      expect(regFeature).toBe(true);
    });
    paymentGroupService.getLDFeature('test')
      .then((response) => {
        expect(response).toBe(true);
      });
  });

    it('Should call get bulk scanning Payment details', () => {
    const paymentGroup = <any>{
        ccd_reference: '1111222233334444',
        exception_record_reference: '1111222233334444',
        payments: [
          {
            amount: 100,
            bgc_reference: 'BGC1203',
            case_reference: '1111222233334444',
            currency: 'GBP',
            date_banked: '2019-DEC-02',
            date_created: '2019-DEC-19',
            date_updated: '2019-DEC-30',
            dcn_case: '11112222333344440',
            dcn_reference: '11112222333344440',
            first_cheque_dcn_in_batch: 'string',
            outbound_batch_number: 'string',
            payer_name: 'tester',
            payment_method: 'CHEQUE',
            po_box: 'string'
          }
        ],
        responsible_service_id: 'AA07'
    };
    spyOn(http, 'get').and.callFake((param1: string) => of(paymentGroup));
    paymentGroupService.getBSPaymentsByDCN('1234')
      .then((response) => {
        expect(response.ccd_reference).toBe(paymentGroup.ccd_reference);
        expect(response.exception_record_reference).toBe(paymentGroup.exception_record_reference);
      }).catch(() => {

      });
  });
  it('Should return true is bulk scann flag is on', () => {
    const features = <any>[
      {
        customProperties: {},
        description: 'enable bulkScan payBubble check',
        enable: true,
        flippingStrategy: null,
        group: null,
        permissions: [],
        uid: 'bulk-scan-enabling-fe'
      }
    ];
    spyOn(features, 'find').and.returnValue(features[0]);
    spyOn(http, 'get').and.callFake(() => of(features));
    http.get('api/payment-history/bulk-scan-feature').subscribe(response => {
      const regFeature = JSON.parse(response).find(feature => feature.uid === BULK_SCANNING_ENABLED),
       result = regFeature ? regFeature.enable : false;
      expect(result).toBe(true);
      expect(response[0].get('uid')).toBe('bulk-scan-enabling-fe');
    });
    paymentGroupService.getBSFeature()
      .then((response) => {
        expect(response).toBe(true);
      });
  });
  it('Should return false is bulk scann flag is off', () => {
    const features = <any>[
      {
        customProperties: {},
        description: 'enable bulkScan payBubble check',
        enable: false,
        flippingStrategy: null,
        group: null,
        permissions: [],
        uid: 'bulk-scan-enabling-fe'
      }
    ];
    spyOn(features, 'find').and.returnValue(features[0]);
    spyOn(http, 'get').and.callFake(() => of(features));
    http.get('api/payment-history/bulk-scan-feature').subscribe(response => {
      const regFeature = JSON.parse(response).find(feature => feature.uid === BULK_SCANNING_ENABLED),
       result = regFeature ? regFeature.enable : false;
      expect(result).toBe(false);
      expect(response[0].get('uid')).toBe('bulk-scan-enabling-fe');
    });
    paymentGroupService.getBSFeature()
      .then((response) => {
        expect(response).toBe(false);
      });
  });
  it('Should return false if bulk scann flag is not available', () => {
    const features = <any>[
      {
        customProperties: {},
        description: 'then requests from all services will be checked against Liberata',
        enable: false,
        flippingStrategy: null,
        group: null,
        permissions: [],
        uid: 'check-liberata-account-for-all-services'
      }
    ];
    spyOn(features, 'find').and.returnValue(features[0]);
    spyOn(http, 'get').and.callFake(() => of(features));
    http.get('api/payment-history/bulk-scan-feature').subscribe(response => {
      const regFeature = JSON.parse(response).find(feature => feature.uid === BULK_SCANNING_ENABLED),
       result = regFeature ? regFeature.enable : false;
      expect(result).toBe(false);
      expect(response[0].get('uid')).not.toBe('bulk-scan-enabling-fe');
    });
    paymentGroupService.getBSFeature()
      .then((response) => {
        expect(response).toBe(false);
      });
  });
});
