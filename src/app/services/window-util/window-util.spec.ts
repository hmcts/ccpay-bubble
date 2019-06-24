import { WindowUtil } from 'src/app/services/window-util/window-util';

describe('window util', () => {
  let windowUtil: WindowUtil;

  beforeEach(() => {
    windowUtil = new WindowUtil();
  });

  it('should return displayMVP to true when the link has .internal', () => {
    windowUtil.setWindowHref('www.testwith.internal');
    expect(windowUtil.displayMVP()).toBeTruthy();
  });

  it('should not activate MVP page with window href without .internal', () => {
    windowUtil.setWindowHref('www.testwith.com');
    expect(windowUtil.displayMVP()).toBeFalsy();
  });

});
