export interface IPaymentModel {
  amount: number;
  description: string;
  reference: string;
  currency: string;
  ccd_case_number: string;
  channel: string;
  method: string;
  external_provider: string;
  status: string;
  site_id: string;
  service_name: string;
}

export interface IFeeModel {
  code: string;
  version: string;
  volume: number;
  calculated_amount: number;
  net_amount: number;
}

export interface IRemissionModel {
  remission_reference: string;
}

export interface IPaymentGroupModel {
  payment_group_reference: string;
  payments: IPaymentModel[];
  remissions: IRemissionModel[];
  fees: IFeeModel[];
}
