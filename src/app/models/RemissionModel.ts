import { FeeModel } from './FeeModel';

export class RemissionModel {

    static model = new RemissionModel();

    hwf_amount: number;
    hwf_reference: string;
    fee: FeeModel;

    static reset(model: RemissionModel) {
        model.hwf_amount = null;
        model.hwf_reference = '';
        model.fee = null;
    }

    assign(model: any) {
        const properties = Object.keys(model);
        for (let i = 0; i < properties.length; i++) {
            this[properties[i]] = model[properties[i]];
        }
    }
}
