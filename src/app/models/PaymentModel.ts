import { FeeModel } from './FeeModel';
import * as _ from 'lodash';

export class PaymentModel {

    static model = new PaymentModel();

    amount: number;
    ccd_case_number: string;
    currency = 'GBP';
    service: string;
    site_id = 'AA02';
    fees: FeeModel[];
    description = 'PayBubble payment';
    channel = 'telephony';
    provider = 'pci pal';

    static reset(model: PaymentModel) {
        model.ccd_case_number = '';
        model.service = '';
        model.fees = [];
        model.amount = null;
    }

    static cleanModel(model: PaymentModel): PaymentModel {
        Object.keys(this.model).forEach(key => {
          if (!_.isEmpty(this.model[key]) || !_.isNull(this.model[key])) {
            model[key] = this.model[key];
          }
        });
        return model;
    }
}
