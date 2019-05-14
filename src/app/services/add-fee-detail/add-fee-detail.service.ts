import { Injectable } from '@angular/core';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { FeeModel } from 'src/app/models/FeeModel';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { feeTypes } from '../../../stubs/feeTypes';
import { IResponse } from 'src/app/interfaces/response';

@Injectable()
export class AddFeeDetailService {
  private _selectedFee: FeeModel;
  private _paymentModel: PaymentModel;
  private _remissionModel: RemissionModel;
  private _remissionRef = '';
  constructor(
    private http: PaybubbleHttpClient
  ) {}

  get paymentModel(): PaymentModel {
    return this._paymentModel;
  }

  set paymentModel(payModel: PaymentModel) {
    this._paymentModel = payModel;
  }

  get remissionModel(): RemissionModel {
    return this._remissionModel;
  }

  set remissionModel(remissionModel: RemissionModel) {
    this._remissionModel = remissionModel;
  }

  get selectedFee(): FeeModel {
    return this._selectedFee;
  }

  set selectedFee(fee: FeeModel) {
    this._selectedFee = fee;
  }

  get remissionRef(): string {
    return this._remissionRef;
  }

  set remissionRef(remissionRef: string) {
    this._remissionRef = remissionRef;
  }

  setNewPaymentModel(props) {
    const paymentModel = new PaymentModel();
    paymentModel.ccd_case_number = props.caseReference;
    paymentModel.fees = [this.selectedFee];
    paymentModel.service = props.serviceType;
    paymentModel.amount = (props.amountToPay === 0 || props.amountToPay)
    ? props.amountToPay : this.selectedFee.calculated_amount;
    this.paymentModel = paymentModel;
  }

  setNewRemissionModel(props) {
    const remissionModel = new RemissionModel();
    remissionModel.ccd_case_number = props.caseReference;
    remissionModel.fee = this.selectedFee;
    remissionModel.hwf_amount = (props.amountToPay === 0 || props.amountToPay)
     ? this.selectedFee.calculated_amount - props.amountToPay : null;
    remissionModel.hwf_reference = props.helpWithFeesCode;
    this.remissionModel = remissionModel;
  }

  buildFeeList(): FeeModel[] {
    return feeTypes.map(data => {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const feeModel = new FeeModel();
        if (data.hasOwnProperty('code')) {
          feeModel.code = data.code;
        }
        if (data.hasOwnProperty('fee_versions')) {
          feeModel.calculated_amount = data.fee_versions[0].flat_amount.amount;
          feeModel.display_amount = '£ ' + parseFloat(feeModel.calculated_amount + '').toFixed(2);
          feeModel.description = data.fee_versions[0].description;
          feeModel.version = `${data.fee_versions[0].version}`;
          feeModel.memo_line = `${data.fee_versions[0].memo_line}`;
          feeModel.natural_account_code = `${data.fee_versions[0].natural_account_code}`;
          feeModel.jurisdiction1 = data.jurisdiction1.name;
          feeModel.jurisdiction2 = data.jurisdiction2.name;
        }
        return feeModel;
      }
    });
  }

  postFullRemission() {
    return this.http.post('/api/remission', RemissionModel.cleanModel(this._remissionModel)).toPromise();
  }

  postPartialRemission(paymentGroupRef: string, feeId: string) {
    return this.http.post(`/api/payment-groups/${paymentGroupRef}/fees/${feeId}/remissions`,
    RemissionModel.cleanModel(this._remissionModel)).toPromise();
  }

  postPartialPayment() {
    return this.http.post('/api/card-payments', PaymentModel.cleanModel(this._paymentModel)).toPromise();
  }

  postPayment() {
    return this.http.post('/api/send-to-payhub', PaymentModel.cleanModel(this._paymentModel)).toPromise();
  }
}
