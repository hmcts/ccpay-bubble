import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../../app.constants';
import { Navigation } from './footer.model';

@Component({
  selector: 'ccpay-bubble-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {
  public navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;
  
  constructor() {}

  public ngOnInit() {}
}
