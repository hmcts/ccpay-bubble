import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AddFeeDetailService {

    constructor(private router: Router) {}

    saveAndContinue() {
        return this.router.navigateByUrl('/reviewFeeDetail');
    }
}
