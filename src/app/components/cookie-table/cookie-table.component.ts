import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-cookie-table',
  standalone: false,
  templateUrl: './cookie-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./cookie-table.component.scss']
})
export class CookieTableComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() labelArray: any;
  @Input() cookieObject: any;
}
