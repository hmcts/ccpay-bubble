import { FeeModel } from './FeeModel';
import * as _ from 'lodash';

export class RemissionModel {

    static model = new RemissionModel();

    beneficiary_name: string;
    ccd_case_number: string;
    fee: FeeModel;
    hwf_amount: number;
    hwf_reference: string;
    payment_group_reference: string;
    site_id = 'AA02';

    static reset(model: RemissionModel) {
        model.beneficiary_name = '';
        model.ccd_case_number = '';
        model.fee = null;
        model.hwf_amount = null;
        model.hwf_reference = '';
        model.payment_group_reference = '';
    }

    static cleanModel(model: RemissionModel): RemissionModel {
        Object.keys(this.model).forEach(key => {
          if (!_.isEmpty(this.model[key]) || !_.isNull(this.model[key])) {
            model[key] = this.model[key];
          }
        });
        return model;
    }

    assign(model: any) {
        const properties = Object.keys(model);
        for (let i = 0; i < properties.length; i++) {
            this[properties[i]] = model[properties[i]];
        }
    }
}
