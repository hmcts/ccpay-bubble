import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fees-summary',
  templateUrl: './fees-summary.component.html',
  styleUrls: ['./fees-summary.component.scss']
})
export class FeesSummaryComponent implements OnInit {

  paymentGroupRef = '2019-15578304238';

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe( params => {
      if (params['reference']) {
        this.paymentGroupRef = params['reference'];
      }
    });
  }

  ngOnInit() {
  }

}
