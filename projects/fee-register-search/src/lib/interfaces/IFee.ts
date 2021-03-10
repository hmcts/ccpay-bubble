import { IVersion } from './';

export interface IFee {
  code: string;
  fee_type: string;
  sort_value: number;
  isdiscontinued_fee: number;
  discontinued_list: any;
  isCurrentAmount_available: number;
  channel_type?: {
    name: string;
  };
  event_type?: {
    name: string;
  };
  jurisdiction1?: {
    name: string;
  };
  jurisdiction2?: {
    name: string;
  };
  service_type?: {
    name: string;
  };
  applicant_type?: {
    name: string;
  };
  fee_versions?: IVersion[];
  current_version?: IVersion;
  unspecified_claim_amount?: boolean;
}
