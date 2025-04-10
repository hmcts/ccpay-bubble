import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TitleService } from "../../../services/title/title.service";

@Component({
  selector: 'app-service-failure',
  templateUrl: './service-failure.component.html',
  styleUrls: ['./service-failure.component.scss']
})
export class ServiceFailureComponent {
  constructor(
    private router: Router,
    private titleService: TitleService
  ) {
    this.titleService.setTitle("Service Failure");
  }

}
