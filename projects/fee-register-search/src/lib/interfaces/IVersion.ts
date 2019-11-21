export interface IVersion {
  description: string;
  status: string;
  author?: string;
  approvedBy?: string;
  version: number;
  valid_from: string;
  valid_to?: string;
  flat_amount?: {
    amount: number;
  };
  percentage_amount?: {
    percentage: number;
  };
  memo_line: string;
  statutory_instrument?: string;
  si_ref_id?: string;
  natural_account_code: string;
  fee_order_name?: string;
  direction: string;
  volume_amount?: {
    amount: number;
  };
}
