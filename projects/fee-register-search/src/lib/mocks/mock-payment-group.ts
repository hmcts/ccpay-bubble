import { IPaymentGroupModel } from '../models/PaymentGroupModel';

export const mockPaymentGroup: IPaymentGroupModel = {
  payment_group_reference: '2019-15578304238',
  payments:
  [{ amount: 400,
    description: 'PayBubble payment',
    reference: 'RC-1557-8304-2381-9924',
    currency: 'GBP',
    ccd_case_number: '1111-2222-3333-4444',
    channel: 'telephony',
    method: 'card',
    external_provider: 'pci pal',
    status: 'Initiated',
    site_id: 'AA02',
    service_name: 'Divorce'
  }],
  remissions: [{
    remission_reference: 'RM-1557-9250-4840-9745',
    hwf_reference: 'HWF-A1B-23C',
    hwf_amount: 500,
    ccd_case_number: '1111-2222-3333-4444',
    fee_code: 'FEE0002'
  }],
  fees: [{
    code: 'FEE0002',
    version: '4',
    volume: 1,
    calculated_amount: 550,
    net_amount: 550
  }]};
