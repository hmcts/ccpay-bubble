export class CaseFeeModel {

    static model = new CaseFeeModel();

    service: string;
    case_reference: string;
    fee: string;
    fee_code: string;
    fee_description: string;
    hwf_code: string;
    amount: number;
    price: string;
    amount_to_pay: number;
    final_amount: string;

    static splitFeeStringToCalculateFeeCodeAndAmount(model: CaseFeeModel) {
        const feeStringArray = model.fee.split('-');
        model.fee_code = feeStringArray[0];
        model.fee_description = feeStringArray[1];
        model.amount = parseFloat(feeStringArray[2]);
        model.price = '£ ' + model.amount.toFixed(2);
        if (!model.amount_to_pay) {
            model.amount_to_pay = model.amount;
        }
        if (model.amount_to_pay) {
            model.final_amount = '£ ' + parseFloat(model.amount_to_pay + '').toFixed(2);
        }
        return model;
    }

    static reset(model: CaseFeeModel) {
        model.service = 'divorce';
        model.case_reference = '';
        model.fee = '';
        model.hwf_code = '';
        model.amount_to_pay = null;
    }

    assign(model: any) {
        const properties = Object.keys(model);
        for (let i = 0; i < properties.length; i++) {
          this[properties[i]] = model[properties[i]];
        }
    }

}
