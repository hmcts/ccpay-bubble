import { Router } from '@angular/router';

export class AddFeeDetailServiceMock {

    constructor(private router: Router) {}

    saveAndContinue() {
        return this.router.navigateByUrl('/reviewFeeDetail');
    }
}
