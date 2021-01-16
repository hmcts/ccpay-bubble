import {Component, EventEmitter, Input, Output} from '@angular/core';
/*
* Gov UK Dialog Component
* Responsible for displaying dialog layout
* using ng-content to display content from parent
* */
@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss']
})
export class SessionDialogComponent  {

  @Input() public positionTop: string;
  @Output() public close = new EventEmitter();
  constructor() {}

  public onClose(): void {
    this.close.emit();
  }

}
