import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhaseBannerComponent implements OnInit {
  @Input() type = 'alpha';

  constructor() { }

  ngOnInit() {
  }

}
