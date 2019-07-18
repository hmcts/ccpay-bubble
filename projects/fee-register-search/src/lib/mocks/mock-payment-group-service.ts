import {defer} from 'rxjs';
import {FeeModel} from '../../../../../src/app/models/FeeModel';
import {mockPaymentGroup} from './mock-payment-group';

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export class MockPaymentGroupService {
  postPaymentGroup(fee: FeeModel) {
    return fakeAsyncResponse(mockPaymentGroup).toPromise();
  }
}
