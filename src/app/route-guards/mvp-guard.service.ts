import { CanActivate, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { WindowUtil } from 'src/app/services/window-util/window-util';

@Injectable()
export class MVPGuard implements CanActivate {

  constructor(private windowUtils: WindowUtil) {}

  canActivate(): boolean {
    return this.windowUtils.displayMVP();
  }
}
