import { Component, OnInit } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { RemissionModel } from 'src/app/models/RemissionModel';
import { feeData } from '../../../stubs/feeData';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  providers: [AddFeeDetailService],
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {

  hwfEntryOn = false;
  allSelected = false;
  service = 'DIVORCE';
  case_reference: string;
  hwf_code: string;
  amount_to_pay: number;
  feeModel: FeeModel;
  feeModels: FeeModel[] = [];
  payModel: PaymentModel;
  remissionModel: RemissionModel;
  feeData = feeData;

  constructor(private addFeeDetailService: AddFeeDetailService) { }

  ngOnInit() {
    this.buildFeeList(this.feeData);
  }

  toggleHwfFields() {
    this.hwfEntryOn = !this.hwfEntryOn;
  }

  saveAndContinue() {
    FeeModel.models = this.filterSelectedFees();
    this.populatePayAndRemissionModel(FeeModel.models);
    this.addFeeDetailService.saveAndContinue();
  }

	filterSelectedFees(): FeeModel[] {
    return this.feeModels.filter(feeModel => feeModel.checked === true);
  }

  selectPaymentInstruction(model: FeeModel) {
    model.checked = !model.checked;
  }

  private populatePayAndRemissionModel(selectedFeeModels: FeeModel[]) {
    PaymentModel.reset(PaymentModel.model);
    this.payModel = new PaymentModel();
    this.payModel.ccd_case_number = this.case_reference;
    this.payModel.fees = selectedFeeModels;
    this.payModel.service = this.service;
    this.payModel.amount = (this.amount_to_pay) ? this.amount_to_pay : selectedFeeModels[0].calculated_amount;
    PaymentModel.model = this.payModel;

    RemissionModel.reset(RemissionModel.model);
    this.remissionModel = new RemissionModel();
    this.remissionModel.fee = selectedFeeModels[0];
    this.remissionModel.hwf_amount = (this.amount_to_pay) ? selectedFeeModels[0].calculated_amount - this.amount_to_pay : null;
    this.remissionModel.hwf_reference = this.hwf_code;
    RemissionModel.model = this.remissionModel;
  }

  buildFeeList(feeData: string) {
		const feesList = JSON.parse(feeData);

    feesList.forEach(data => {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        this.feeModel = new FeeModel();
        this.feeModel.checked = false;
        if (data.hasOwnProperty('code')) {
          this.feeModel.code = data.code;
        }
        if (data.hasOwnProperty('fee_versions')) {
          this.feeModel.calculated_amount = data.fee_versions[0].flat_amount.amount;
          this.feeModel.display_amount = '£ ' + parseFloat(this.feeModel.calculated_amount + '').toFixed(2);
          this.feeModel.description = data.fee_versions[0].description;
          this.feeModel.version = data.fee_versions[0].version;
        }
      }
      this.feeModels.push(this.feeModel);
    });
  }

}
