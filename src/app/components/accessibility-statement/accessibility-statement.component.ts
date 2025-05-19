import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FeepayTitleService } from "../../services/feepay-title/feepay.title.service";

@Component({
  selector: 'app-accessibility-statement',
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
})
export class AccessibilityStatementComponent {
  constructor(
    private _location: Location,
    private titleService: FeepayTitleService
  )
  {
    this.titleService.setTitle("Accessibility Statement");
  }

  backClicked() {
    this._location.back();
  }
}
