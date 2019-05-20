import { Injectable } from '@angular/core';

@Injectable()
export class WindowUtil {

  private windowHref = window.location.href;

  constructor() {
  }

  getWindowHref(): string {
    return this.windowHref;
  }

  setWindowHref(href: string) {
    this.windowHref = href;
  }

  displayFeeSearch(): boolean {
    return this.windowHref.indexOf('.internal') > 0;
  }

  breakOutOfIframe() {
    if (window.location !== window.top.location) {
      console.log('inside an iframe and break out');
      window.top.location = window.location;
    } else {
      console.log('not in iframe');
    }
  }
}
