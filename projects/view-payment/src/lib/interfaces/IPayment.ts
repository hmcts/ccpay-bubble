import { IFee } from './IFee';
import { IStatusHistory } from './IStatusHistory';

export interface IPayment {
  account_number: string;
  amount: number;
  case_reference: string;
  channel: string;
  currency: string;
  customer_reference: string;
  date_created: string;
  date_updated: string;
  description: string;
  external_provider: string;
  external_reference: string;
  fees: IFee[];
  giro_slip_no: string;
  id: string;
  method: string;
  organisation_name: string;
  payment_group_reference: string;
  payment_reference: string;
  reference: string;
  reported_date_offline: string;
  service_name: string;
  site_id: string;
  status: string;
  status_histories: IStatusHistory[];
}

