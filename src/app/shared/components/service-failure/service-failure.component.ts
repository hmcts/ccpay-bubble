import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-service-failure',
  templateUrl: './service-failure.component.html',
  styleUrls: ['./service-failure.component.scss']
})
export class ServiceFailureComponent {
  constructor(
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("CCPay Service Failure");
  }

}
