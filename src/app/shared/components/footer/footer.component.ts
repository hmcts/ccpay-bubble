import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ccpay-bubble-app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

  constructor() {}

  public ngOnInit() {}
}
