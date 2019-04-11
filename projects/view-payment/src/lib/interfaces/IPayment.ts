import { IFee, IStatusHistory } from './';

export interface IPayment {
  amount?: number;
  date_created?: string;
  date_updated?: string;
  currency?: string;
  ccd_case_number?: string;
  case_reference?: string;
  payment_reference?: string;
  channel?: string;
  method?: string;
  site_id?: string;
  status?: string;
  service_name?: string;
  customer_reference?: string;
  account_number?: string;
  organisation_name?: string;
  payment_group_reference?: string;
  description?: string;
  fees?: IFee[];
  status_histories?: IStatusHistory[];
}
