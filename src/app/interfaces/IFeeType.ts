export interface IFeeType {
  code: string;
  fee_type: string;
  channel_type: {
    name: string;
  };
  event_type: {
    name: string;
  };
  jurisdiction1: {
    name: string
  };
  jurisdiction2: {
    name: string
  };
  service_type: {
    name: string
  };
  applicant_type: {
    name: string
  };
  fee_versions: IVersion[];
  current_version: IVersion;
  unspecified_claim_amount: boolean;
}

interface IVersion {
  description: string;
  status: string;
  version: number;
  valid_from: string;
  flat_amount: {
    amount: number;
  };
  memo_line: string;
  statutory_instrument: string;
  si_ref_id: string;
  natural_account_code: string;
  fee_order_name: string;
  direction: string;
}
