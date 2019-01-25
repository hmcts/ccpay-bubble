import { Component, OnInit } from '@angular/core';
import { CaseFeeModel } from 'src/app/models/CaseFeeModel';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review-fee-detail',
  templateUrl: './review-fee-detail.component.html',
  styleUrls: ['./review-fee-detail.component.scss']
})
export class ReviewFeeDetailComponent implements OnInit {

  caseFeeModel = CaseFeeModel.model;

  constructor(private location: Location) { }

  ngOnInit() {
    this.caseFeeModel = CaseFeeModel.splitFeeStringToCalculateFeeCodeAndAmount(this.caseFeeModel);
  }

  onGoBack() {
    return this.location.back();
  }

}
