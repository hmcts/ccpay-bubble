import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';

@Injectable()
export class ConfirmationGuard implements CanActivate {
  constructor(
    private router: Router,
    private addFeeDetailService: AddFeeDetailService
  ) {}

  canActivate(): boolean {
    if (this.addFeeDetailService.remissionRef !== '') { return true; }
    this.router.navigate(['/addFeeDetail']);
    return false;
  }
}
