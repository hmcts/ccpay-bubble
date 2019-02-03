import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { PaymentModel } from 'src/app/models/PaymentModel';
import { Observable } from 'rxjs';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';

@Injectable()
export class AddFeeDetailService {

    constructor(
        private router: Router,
        private http: PaybubbleHttpClient
        ) {}

    saveAndContinue() {
        return this.router.navigateByUrl('/reviewFeeDetail');
    }

    sendPayDetailsToPayhub(payModel: PaymentModel): Observable<any> {
        return this.http.post('/api/send-to-payhub', payModel);
    }
}
