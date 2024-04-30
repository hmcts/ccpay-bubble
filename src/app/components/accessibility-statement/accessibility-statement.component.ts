import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-accessibility-statement',
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
})
export class AccessibilityStatementComponent {
  constructor(
    private _location: Location,
    private titleService: Title
  ) 
  {
    this.titleService.setTitle("CCPay Accessibility Statement");
  }

  backClicked() {
    this._location.back();
  }
}
