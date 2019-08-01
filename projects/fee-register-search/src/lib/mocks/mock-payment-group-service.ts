import {FeeModel} from '../../../../../src/app/models/FeeModel';


export class MockPaymentGroupService {
  postPaymentGroup(fee: FeeModel) {
    return {
      then: (fun) => fun({payment_group_reference: '2019-12341234'})
    };
  }
}
