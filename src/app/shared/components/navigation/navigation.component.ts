import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { createAll, ServiceNavigation } from 'govuk-frontend';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit {
  @Input() isBulkscanningEnable: boolean;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    createAll(ServiceNavigation, undefined, {
      scope: this.elementRef.nativeElement,
      onError(error) {
        throw error;
      }
    });
  }
}
