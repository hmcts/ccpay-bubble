import { MVPGuard } from './mvp-guard.service';
import { WindowUtil } from 'src/app/services/window-util/window-util';

describe('Fee Search route guard', () => {
  let mvpGuard: MVPGuard;
  let windowUtil: WindowUtil;

  beforeEach(() => {
    windowUtil = new WindowUtil();
    mvpGuard = new MVPGuard(windowUtil);
  });

  it('should activate fee search page with window href .internal', () => {
    windowUtil.setWindowHref('www.testwith.internal');
    expect(mvpGuard.canActivate()).toBeTruthy();
  });

  it('should not activate fee search page with window href without .internal', () => {
    windowUtil.setWindowHref('www.testwith.com');
    expect(mvpGuard.canActivate()).toBeFalsy();
  });

});
