export class FeeModel {

    static models: FeeModel[];

    calculated_amount: number;
    ccd_case_number: string;
    code: string;
    reference: string;
    version: string;
    volume = 1;
    hwf_amount: number;
    hwf_code: string;
    amount: number;
    description: string;
    display_calculated_amount: string;
    display_amount: string;
    checked: boolean;

    static setCalculatedAmount(model: FeeModel) {
        if (!model.hwf_amount) {
            model.calculated_amount = model.amount;
        } else {
            model.calculated_amount = model.hwf_amount;
        }
        model.display_calculated_amount = '£ ' + parseFloat(model.calculated_amount + '').toFixed(2);
        model.display_amount = '£ ' + parseFloat(model.amount + '').toFixed(2);
        return model;
    }

    assign(model: any) {
        const properties = Object.keys(model);
        for (let i = 0; i < properties.length; i++) {
          this[properties[i]] = model[properties[i]];
        }
    }
}
