import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TitleService } from "../../services/title/title.service";

@Component({
  selector: 'app-accessibility-statement',
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
})
export class AccessibilityStatementComponent {
  constructor(
    private _location: Location,
    private titleService: TitleService
  )
  {
    this.titleService.setTitle("Accessibility Statement");
  }

  backClicked() {
    this._location.back();
  }
}
