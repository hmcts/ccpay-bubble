import { Component, OnInit } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { CaseFeeModel } from 'src/app/models/CaseFeeModel';
import { FeeModel } from 'src/app/models/FeeModel';
import { PaymentModel } from 'src/app/models/PaymentModel';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  providers: [AddFeeDetailService],
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {

  hwfEntryOn = false;
  allSelected = false;
  service: string;
  case_reference: string;
  hwf_code: string;
  amount_to_pay: number;
  model = CaseFeeModel.model;
  feeModel: FeeModel;
  feeModels: FeeModel[] = [];
  payModel = PaymentModel.model;
  feeData = `
  [
  {
		"code": "FEE001",
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
				"description": "Application for Divorce",
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
			"description": "Application for Divorce",
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
				"description": "Defend Divorce",
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
			"description": "Defend Divorce",
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
				"description": "Divorce Amend Petition",
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
			"description": "Divorce Amend Petition",
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
				"description": "Divorce Financial Consent Order",
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
			"description": "Divorce Financial Consent Order",
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
				"description": "Bailiff Service",
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
			"description": "Bailiff Service",
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
				"description": "Divorce Submit Form A",
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
			"description": "Divorce Submit Form A",
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
				"description": "Divorce Use Non Residential Address",
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
			"description": "Divorce Use Non Residential Address",
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
		"code": "FEE002",
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
				"description": "Copies of Documents",
				"status": "approved",
				"version": 4,
				"valid_from": "2016-03-21T00:00:00.000+0000",
				"flat_amount": {
					"amount": 0.50
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
			"description": "Copies of Documents",
			"status": "approved",
			"version": 4,
			"valid_from": "2016-03-21T00:00:00.000+0000",
			"flat_amount": {
				"amount": 0.50
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
    // this.model.service = 'divorce';
    CaseFeeModel.reset(this.model);
    this.feeModels = [];
    this.buildFeeList();
  }

  toggleHwfFields() {
    this.hwfEntryOn = !this.hwfEntryOn;
  }

  saveAndContinue() {
    const selectedFeeModels = this.feeModels.filter(
      feeModel => feeModel.checked === true
    ).map((feeModel) => {
      feeModel.hwf_amount = this.amount_to_pay;
      feeModel.hwf_code = this.hwf_code;
      return FeeModel.setCalculatedAmount(feeModel);
    });
    FeeModel.models = selectedFeeModels;
    this.populatePayModel(this.payModel, selectedFeeModels);
    this.addFeeDetailService.saveAndContinue();
  }

  selectPaymentInstruction(model: FeeModel) {
    model.checked = !model.checked;
  }

  private populatePayModel(payModel: PaymentModel, selectedFeeModels: FeeModel[]) {
    payModel.reset();
    payModel.ccd_case_number = this.case_reference;
    payModel.fees = selectedFeeModels;
    payModel.service = this.service;
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
          this.feeModel.amount = data.fee_versions[0].flat_amount.amount;
          this.feeModel.display_amount = '£ ' + parseFloat(this.feeModel.amount + '').toFixed(2);
          this.feeModel.description = data.fee_versions[0].description;
          this.feeModel.version = data.fee_versions.version;
        }
      }
      this.feeModels.push(this.feeModel);
    });
  }

}
