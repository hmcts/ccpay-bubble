import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-failure',
  standalone: false,
  templateUrl: './service-failure.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./service-failure.component.scss']
})
export class ServiceFailureComponent {
  constructor(private router: Router) {}

}
