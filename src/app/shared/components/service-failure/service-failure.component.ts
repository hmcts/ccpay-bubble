import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-failure',
  standalone: false,
  templateUrl: './service-failure.component.html',
  styleUrls: ['./service-failure.component.scss']
})
export class ServiceFailureComponent {
  constructor(private router: Router) {}

}
