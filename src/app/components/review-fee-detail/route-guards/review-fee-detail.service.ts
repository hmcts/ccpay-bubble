import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ReviewFeeDetailRouteGuard implements CanActivate {
  constructor(
    private addFeeDetailService: AddFeeDetailService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.addFeeDetailService.selectedFee) { return true; }
    this.router.navigate(['/addFeeDetail']);
    return false;
  }
}
