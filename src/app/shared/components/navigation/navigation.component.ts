import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ServiceNavigation } from 'govuk-frontend/dist/govuk/components/service-navigation/service-navigation.mjs';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit {
  @Input() isBulkscanningEnable: boolean;
  @ViewChild('serviceNavigation', { static: true }) private serviceNavigation: ElementRef<HTMLElement>;
  todaysDate = Date.now();

  ngAfterViewInit() {
    new ServiceNavigation(this.serviceNavigation.nativeElement);
  }
}
