import { Injectable } from '@angular/core';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { FeeModel } from 'src/app/models/FeeModel';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { feeTypes } from '../../../stubs/feeTypes';

@Injectable()
export class AddFeeDetailService {
  private _selectedFee: FeeModel;
  private _paymentModel: PaymentModel;
  private _remissionModel: RemissionModel;
  caseReference = '';
  serviceType = 'DIVORCE';
  amountToPay = 0.00;
  helpWithFeesCode = '';
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

  setNewPaymentModel() {
    const paymentModel = new PaymentModel();
    paymentModel.ccd_case_number = this.caseReference;
    paymentModel.fees = [this.selectedFee];
    paymentModel.service = this.serviceType;
    paymentModel.amount = (this.amountToPay) ? this.amountToPay : this.selectedFee.calculated_amount;
    this.paymentModel = paymentModel;
  }

  setNewRemissionModel() {
    const remissionModel = new RemissionModel();
    remissionModel.fee = this.selectedFee;
    remissionModel.hwf_amount = (this.amountToPay) ? this.selectedFee.calculated_amount - this.amountToPay : null;
    remissionModel.hwf_reference = this.helpWithFeesCode;
    RemissionModel.model = this.remissionModel;
    this.remissionModel = remissionModel;
  }

  buildFeeList(): FeeModel[] {
    return feeTypes.map(data => {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const feeModel = new FeeModel();
        feeModel.checked = false;
        if (data.hasOwnProperty('code')) {
          feeModel.code = data.code;
        }
        if (data.hasOwnProperty('fee_versions')) {
          feeModel.calculated_amount = data.fee_versions[0].flat_amount.amount;
          feeModel.display_amount = '£ ' + parseFloat(feeModel.calculated_amount + '').toFixed(2);
          feeModel.description = data.fee_versions[0].description;
          feeModel.version = `${data.fee_versions[0].version}`;
        }
        return feeModel;
      }
    });
  }

  sendPayDetailsToPayhub(): Observable<any> {
    return this.http.post('/api/send-to-payhub', PaymentModel.cleanModel(this._paymentModel));
  }
}
