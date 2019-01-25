import { Component, OnInit } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { CaseFeeModel } from 'src/app/models/CaseFeeModel';

@Component({
  selector: 'app-add-fee-detail',
  templateUrl: './add-fee-detail.component.html',
  providers: [AddFeeDetailService],
  styleUrls: ['./add-fee-detail.component.scss']
})
export class AddFeeDetailComponent implements OnInit {

  hwfEntryOn = false;
  model = CaseFeeModel.model;

  constructor(private addFeeDetailService: AddFeeDetailService) { }

  ngOnInit() {
    // this.model.service = 'divorce';
    CaseFeeModel.reset(this.model);
  }

  toggleHwfFields() {
    this.hwfEntryOn = !this.hwfEntryOn;
  }

  saveAndContinue() {
    this.addFeeDetailService.saveAndContinue();
  }

}
