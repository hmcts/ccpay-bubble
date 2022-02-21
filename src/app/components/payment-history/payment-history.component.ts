import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdamDetails } from '../../services/idam-details/idam-details';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import * as ls from 'local-storage';
import {Router} from '@angular/router';
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  apiRoot: string;
  bulkscanapiRoot: string;
  refundsapiRoot: string;
  notificationapiRoot: string;
  view: string;
  takePayment: boolean;
  ccdCaseNumber: string;
  excReference: string;
  paymentGroupRef: string;
  dcnNumber: string;
  selectedOption: string;
  isBulkscanningEnable: boolean;
  isStrategicFixEnable: boolean;
  isTurnOff: boolean;
  caseType: string;
  isOldPcipalOff: boolean;
  isNewPcipalOff: boolean;
  servicerequest: string;
  refundlist: string;
  LOGGEDINUSEREMAIL: string;
  LOGGEDINUSERROLES: string[];
  cardPaymentReturnUrl: string;
  lsCcdNumber: any = ls.get<any>('ccdNumber');

  userRoles = [
    'IDAM_SUPER_USER',
    'caseworker-probate-authorize',
    'caseworker',
    'caseworker-divorce',
    'payments',
    'payments-refund-approver',
    'payments-refund'
  ];

  constructor(private router: Router,
    private paymentGroupService: PaymentGroupService,
    private activatedRoute: ActivatedRoute,
    private idamDetails: IdamDetails
  ) { }

  ngOnInit() {
    this.paymentGroupService.getEnvironment().then(env => {
      this.cardPaymentReturnUrl = env;
      this.idamDetails.getUserRoles().subscribe(roles => {
        this.activatedRoute.params.subscribe(
          {
            next: (params) => {
              this.apiRoot = 'api/payment-history';
              this.bulkscanapiRoot = 'api/bulk-scan';
              this.refundsapiRoot = 'api/refund';
              this.notificationapiRoot = 'api/notification';
              this.ccdCaseNumber = params['ccdCaseNumber'];
              this.isBulkscanningEnable = this.activatedRoute.snapshot.queryParams['isBulkScanning'] === 'Enable';
              this.isStrategicFixEnable = this.activatedRoute.snapshot.queryParams['isStFixEnable'] === 'Enable';
              this.isOldPcipalOff = this.activatedRoute.snapshot.queryParams['isOldPcipalOff'] === 'Enable';
              this.isNewPcipalOff = this.activatedRoute.snapshot.queryParams['isNewPcipalOff'] === 'Enable';
              this.isTurnOff = this.activatedRoute.snapshot.queryParams['isTurnOff'] === 'Enable';
              this.excReference = this.activatedRoute.snapshot.queryParams['exceptionRecord'];
              this.view = this.activatedRoute.snapshot.queryParams['view'];
              this.takePayment = this.activatedRoute.snapshot.queryParams['takePayment'];
              this.paymentGroupRef = this.activatedRoute.snapshot.queryParams['paymentGroupRef'];
              this.dcnNumber = this.activatedRoute.snapshot.queryParams['dcn'];
              this.selectedOption = this.activatedRoute.snapshot.queryParams['selectedOption'];
              this.caseType = this.activatedRoute.snapshot.queryParams['caseType'];
              this.servicerequest = this.activatedRoute.snapshot.queryParams['servicerequest'];
              this.refundlist = this.activatedRoute.snapshot.queryParams['refundlist'];
              this.LOGGEDINUSEREMAIL = '';
              this.LOGGEDINUSERROLES = roles;
            }
          });
      });
      this.checkValidUser();
    });
  }

  checkValidUser() {
    const currenturl = (this.router.url).split('?', 1);
    if ( this.lsCcdNumber !== this.ccdCaseNumber
      && !(currenturl[0] === '/refund-list' || currenturl[0] === '/payment-history/view')) {
      this.router.navigateByUrl('/ccd-search?takePayment=true');
    }
  }
}
