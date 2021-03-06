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

  displayMVP(): boolean {
   return this.windowHref.indexOf('.internal') > 0 || this.windowHref.indexOf('localhost') > 0;
  }
}
