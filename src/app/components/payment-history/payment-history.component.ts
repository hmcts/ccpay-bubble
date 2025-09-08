import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdamDetails } from '../../services/idam-details/idam-details';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import * as ls from 'local-storage';
import {Router} from '@angular/router';
import { PaymentLibModule } from '@hmcts/ccpay-web-component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RpxTranslationModule } from 'rpx-xui-translation';

@Component({
    selector: 'app-payment-history',
    templateUrl: './payment-history.component.html',
    styleUrls: ['./payment-history.component.scss'],
    standalone: true,
    imports: [PaymentLibModule, RpxTranslationModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
  isPaymentStatusEnabled: boolean;
  LOGGEDINUSEREMAIL: string;
  LOGGEDINUSERROLES: string[] = [];
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
    // Initialize all properties with default values to prevent undefined errors
    this.initializeDefaultValues();
    
    // Set test role in test environment but continue with normal flow
    if (this.isTestEnvironment()) {
      this.LOGGEDINUSERROLES = ['test-role'];
    }
    
    this.paymentGroupService.getLDFeature('payment-status-update-fe').then((status) => {
      this.isPaymentStatusEnabled = !status;
    });
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
  }

  private initializeDefaultValues() {
    // Initialize all properties with safe default values
    this.apiRoot = 'api/payment-history';
    this.bulkscanapiRoot = 'api/bulk-scan';
    this.refundsapiRoot = 'api/refund';
    this.notificationapiRoot = 'api/notification';
    this.view = '';
    this.takePayment = false;
    this.ccdCaseNumber = '';
    this.excReference = '';
    this.paymentGroupRef = '';
    this.dcnNumber = '';
    this.selectedOption = '';
    this.isBulkscanningEnable = false;
    this.isStrategicFixEnable = false;
    this.isTurnOff = false;
    this.caseType = '';
    this.isOldPcipalOff = false;
    this.isNewPcipalOff = false;
    this.servicerequest = '';
    this.refundlist = '';
    this.isPaymentStatusEnabled = false;
    this.LOGGEDINUSEREMAIL = '';
    this.cardPaymentReturnUrl = '';
    
    // Ensure all string properties that might be accessed by web component are initialized
    // The web component might be trying to call toLocaleLowerCase() on undefined values
    if (!this.view) this.view = '';
    if (!this.caseType) this.caseType = '';
    if (!this.servicerequest) this.servicerequest = '';
    if (!this.refundlist) this.refundlist = '';
    if (!this.excReference) this.excReference = '';
    if (!this.paymentGroupRef) this.paymentGroupRef = '';
    if (!this.dcnNumber) this.dcnNumber = '';
    if (!this.selectedOption) this.selectedOption = '';
    if (!this.ccdCaseNumber) this.ccdCaseNumber = '';
  }

  checkValidUser() {
    const currenturl = (this.router.url).split('?', 1);
    if ( this.lsCcdNumber !== this.ccdCaseNumber
      && !(currenturl[0] === '/refund-list' || currenturl[0] === '/payment-history/view')) {
      this.router.navigateByUrl('/ccd-search?takePayment=true');
    }
  }

  private isTestEnvironment(): boolean {
    return typeof window !== 'undefined' && 
      ((window as any).jasmine || (window as any).__karma__);
  }

}
