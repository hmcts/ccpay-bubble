import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isBSFlagEnable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
