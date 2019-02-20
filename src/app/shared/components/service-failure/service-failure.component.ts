import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-failure',
  templateUrl: './service-failure.component.html',
  styleUrls: ['./service-failure.component.scss']
})
export class ServiceFailureComponent {
  constructor(private router: Router) {}

  goToAddFeeDetail() {
    return this.router.navigate(['/addFeeDetail']);
  }
}
