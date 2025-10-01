import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cookie-table',
  standalone: false,
  templateUrl: './cookie-table.component.html',
  styleUrls: ['./cookie-table.component.scss']
})
export class CookieTableComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() labelArray: any;
  @Input() cookieObject: any;
}
