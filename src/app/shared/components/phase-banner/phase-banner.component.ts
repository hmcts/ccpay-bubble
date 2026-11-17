import { Component, Input, ViewEncapsulation, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-phase-banner',
  standalone: false,
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class PhaseBannerComponent {
  @Input() type = 'beta';

  myFunction () {
    const myInput = (document.querySelector('.iFrameDrivenImageValue') as HTMLInputElement).value;
    const myArray = ['test', 'CCDSEARCH', 'FEEDETAILS', 'FEEVERSION', 'SEARCHFEES', 'ADDREMISSION', 'ADDREMISSIONCONFIRMATION',
    'PROCESSADDRETROREMISSIONPAGE', 'PROCESSRETROREMISSIONPAGE', 'CHECKRETROREMISSIONCONFIRMATION', 'RETROREMISSIONCONFIRMATIONPAGE',
    'RETROREMISSIONREFUNDCONFIRMATIONPAGE', 'ISSUEREFUNDPAGE', 'CHECKISSUEREFUNDPAGE', 'ADDREFUNDFORREMISSION', 'ALLOCATEPAYMENTS',
    'ORDERIDDETAILS', 'FEEREMOVALCONFIRMATION_2', 'FEESUMMARY', 'FEEREMOVALCONFIRMATION_1', 'PCIPAL', 'MARKUNIDENTIFIED',
    'UNIDENTIFIEDCONFIRMATION', 'CANCELUNIDENTIFIED', 'MARKTRANSFERRED', 'TRANSFERREDCONFIRMATION',
    'CANCELTRANSFERRED', 'PAYMENTDETAILS', 'REPORTS', 'CASETRANSACTION', 'CONFIRMALLOCATION_SURPLUS', 'CONFIRMALLOCATION_SHORTFALL',
    'CONFIRMALLOCATION'];
    for (const valueOfMyInput of myArray) {
      if (valueOfMyInput === myInput) {
        const strDest = 'https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + valueOfMyInput;
        window.open(strDest, '_blank');
      }
    }
  }
}
