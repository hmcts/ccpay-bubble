import { FeeModel } from './FeeModel';

export class PaymentModel {

    static model = new PaymentModel();

    ccd_case_number: string;
    currency = 'GBP';
    service: string;
    site_id = 'B001';
    fees: FeeModel[];

    reset() {
        this.ccd_case_number = '';
        this.service = '';
        this.fees = [];
    }
}
