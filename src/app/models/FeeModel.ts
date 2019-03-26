export class FeeModel {

    static models: FeeModel[];

    calculated_amount: number;
    ccd_case_number: string;
    code: string;
    reference: string;
    version: string;
    volume = 1;
    description: string;
    checked: boolean;
    display_amount: string;
    memo_line: string;
    natural_account_code: string;
    jurisdiction1: string;
    jurisdiction2: string;

    assign(model: any) {
        const properties = Object.keys(model);
        for (let i = 0; i < properties.length; i++) {
          this[properties[i]] = model[properties[i]];
        }
    }
}
