import { Component, OnInit , Input} from '@angular/core';
import { WindowUtil } from 'src/app/services/window-util/window-util';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [DatePipe]
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
