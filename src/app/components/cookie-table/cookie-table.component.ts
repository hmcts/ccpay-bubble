import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-cookie-table',
  standalone: true,
  templateUrl: './cookie-table.component.html',
  styleUrls: ['./cookie-table.component.scss'],
  imports: []
})
export class CookieTableComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() labelArray: any;
  @Input() cookieObject: any;
}
