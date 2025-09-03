import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-accessibility-statement',
  standalone: false,
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
})
export class AccessibilityStatementComponent {
  constructor(private _location: Location)
  {}

  backClicked() {
    this._location.back();
  }
}
