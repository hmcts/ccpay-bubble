import {Observable, of} from 'rxjs';
import {mockFees} from './mock-fees';
import {FeeModel} from '../../../../../src/app/models/FeeModel';
import {IPaymentGroup} from '@hmcts/ccpay-web-component/lib/interfaces/IPaymentGroup';
import {mockPaymentGroup} from './mock-payment-group';


export class MockPaymentGroupService {
  postPaymentGroup(fee: FeeModel) {
    return of(mockPaymentGroup).toPromise();
  }
}
