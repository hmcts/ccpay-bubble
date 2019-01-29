import { FeeModel } from './FeeModel';

export class PaymentModel {

    static model = new PaymentModel();

    amount: number;
    ccd_case_number: string;
    currency = 'GBP';
    service: string;
    site_id = 'B001';
    fees: FeeModel[];
    description = 'PayBubble payment';

    static reset(model: PaymentModel) {
        model.ccd_case_number = '';
        model.service = '';
        model.fees = [];
        model.amount = null;
    }
}
