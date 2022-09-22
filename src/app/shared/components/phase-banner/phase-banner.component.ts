import { Component, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { BulkScanService } from 'express/services/';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhaseBannerComponent {
  @Input() type = 'beta';

  myFunction () {
    const myInput = (document.getElementById('iFrameDrivenImageValue') as HTMLInputElement).value;
    const myInput2 = (document.getElementById('iFrameDrivenImageValue2') as HTMLInputElement).value;
    const myInput3 = (document.getElementById('iFrameDrivenImageValue3') as HTMLInputElement).value;
    const myInput4 = (document.getElementById('iFrameDrivenImageValue4') as HTMLInputElement).value;
    const myInput5 = (document.getElementById('iFrameDrivenImageValue5') as HTMLInputElement).value;
    const myInput6 = (document.getElementById('iFrameDrivenImageValue6') as HTMLInputElement).value;
    if ((myInput != null) || (myInput.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
    if ((myInput2 != null) || (myInput2.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
    if ((myInput3 != null) || (myInput3.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
    if ((myInput4 != null) || (myInput4.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
    if ((myInput5 != null) || (myInput5.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
    if ((myInput5 != null) || (myInput5.length !== 0)) {
      window.open('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=' + myInput, '_blank');
    }
  }
}
