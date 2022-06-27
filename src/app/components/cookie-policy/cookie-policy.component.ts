import { Component, OnInit} from '@angular/core';
import cookieManager from '@hmcts/cookie-manager';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']

})

export class CookiePolicyComponent implements OnInit {
    ngOnInit(): void {
      cookieManager.on('PreferenceFormSubmitted', () => {
        const message = document.querySelector('.cookie-preference-success') as HTMLElement;
        message.style.display = 'block';
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      });
    }
}
