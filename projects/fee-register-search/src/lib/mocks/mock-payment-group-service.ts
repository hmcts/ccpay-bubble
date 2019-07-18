import {defer} from 'rxjs';
import {FeeModel} from '../../../../../src/app/models/FeeModel';
import {mockPaymentGroup} from './mock-payment-group';


export class MockPaymentGroupService {
  postPaymentGroup(fee: FeeModel) {
    return {
      then: (fun) => fun({payment_group_reference: '2019-12341234'})
    };
  }
}
