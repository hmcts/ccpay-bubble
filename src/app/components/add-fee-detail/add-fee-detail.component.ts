import { Component, OnInit } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { RemissionModel } from 'src/app/models/RemissionModel';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  providers: [AddFeeDetailService],
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {

  hwfEntryOn = false;
  allSelected = false;
  service = 'divorce';
  case_reference: string;
  hwf_code: string;
  amount_to_pay: number;
  feeModel: FeeModel;
  feeModels: FeeModel[] = [];
  payModel: PaymentModel;
  remissionModel: RemissionModel;
  feeData = `
  [
  {
		"code": "FEE0002",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Filing an application for a divorce, nullity or civil partnership dissolution",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 550.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Filing an application for a divorce, nullity or civil partnership dissolution",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 550.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0387",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Originating proceedings where no other fee is specified",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 245.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Originating proceedings where no other fee is specified",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 245.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0232",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Amendment of application for matrimonial/civil partnership order",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 95.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Amendment of application for matrimonial/civil partnership order",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 95.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0270",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Application for decree nisi, conditional order, separation order (no fee if undefended)",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 50.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Application for decree nisi, conditional order, separation order (no fee if undefended)",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 50.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0391",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Request for service by a bailiff of document (see order for exceptions)",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 110.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Request for service by a bailiff of document (see order for exceptions)",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 110.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0229",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Application for a financial order",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 255.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Application for a financial order",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 255.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    },
    {
		"code": "FEE0228",
		"fee_type": "fixed",
		"channel_type": {
			"name": "default"
		},
		"event_type": {
			"name": "issue"
		},
		"jurisdiction1": {
			"name": "family"
		},
		"jurisdiction2": {
			"name": "family court"
		},
		"service_type": {
			"name": "divorce"
		},
		"applicant_type": {
			"name": "all"
		},
		"fee_versions": [
			{
				"description": "Application (without notice)",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 50.00
				},
				"memo_line": "GOV - App for divorce/nullity of marriage or CP",
				"statutory_instrument": "2016 No. 402 (L. 5)",
				"si_ref_id": "1.2",
				"natural_account_code": "4481102159",
				"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
				"direction": "enhanced"
			}
		],
		"current_version": {
			"description": "Application (without notice)",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 50.00
			},
			"memo_line": "GOV - App for divorce/nullity of marriage or CP",
			"statutory_instrument": "2016 No. 402 (L. 5)",
			"si_ref_id": "1.2",
			"natural_account_code": "4481102159",
			"fee_order_name": "The Civil Proceedings, Family Proceedings and Upper Tribunal Fees (Amendment) Order 2016",
			"direction": "enhanced"
		},
		"unspecified_claim_amount": false
    }
  ]`;

  constructor(private addFeeDetailService: AddFeeDetailService) { }

  ngOnInit() {
    this.feeModels = [];
    this.buildFeeList();
  }

  toggleHwfFields() {
    this.hwfEntryOn = !this.hwfEntryOn;
  }

  saveAndContinue() {
    const selectedFeeModels = this.feeModels.filter(
      feeModel => feeModel.checked === true
    );
    FeeModel.models = selectedFeeModels;
    this.populatePayAndRemissionModel(selectedFeeModels);
    this.addFeeDetailService.saveAndContinue();
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

    console.log('PayModel: ' + JSON.stringify(PaymentModel.model));
    console.log('RemissionModel: ' + JSON.stringify(RemissionModel.model));
    console.log('FeeModel: ' + JSON.stringify(selectedFeeModels[0]));
  }

  buildFeeList() {
    const feesList = JSON.parse(this.feeData);
    feesList.forEach(data => {
      const keys = Object.keys(data);
      let i = 0;
      for (i = 0; i < keys.length; i++) {
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
