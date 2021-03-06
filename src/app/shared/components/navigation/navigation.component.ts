import { Component, OnInit , Input} from '@angular/core';
import { WindowUtil } from 'src/app/services/window-util/window-util';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() isBulkscanningEnable: boolean;
  todaysDate = Date.now();
  showMVP = true;

  constructor(private windowUtil: WindowUtil) { }

  ngOnInit() {
    this.showMVP = this.windowUtil.displayMVP();
  }
}
