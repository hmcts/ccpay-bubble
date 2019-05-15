export class FeeResponseModel {
  id: number;
  code: string;
  version: string;
  volume: number;
  calculated_amount: number;
}

export class RemissionResponseModel {
  remission_reference: string;
  payment_group_reference: string;
  fee: FeeResponseModel;
}

export class PaymentResponseModel {
}
