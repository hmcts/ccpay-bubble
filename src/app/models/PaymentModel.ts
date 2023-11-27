import {FeeModel} from './FeeModel';

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

  static cleanModel(paymentModel: PaymentModel): PaymentModel {

    Object.keys(this.model).forEach(key => {
      if (paymentModel[key] == null || paymentModel[key] == undefined) {
        paymentModel[key] = this.model[key];
      }
    });
    return paymentModel;
  }
}
