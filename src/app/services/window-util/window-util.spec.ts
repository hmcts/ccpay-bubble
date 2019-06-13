import { WindowUtil } from 'src/app/services/window-util/window-util';

describe('Fee Search route guard', () => {
  let windowUtil: WindowUtil;

  beforeEach(() => {
    windowUtil = new WindowUtil();
  });

  it('should return displayFeeSearch to true when the link has .internal', () => {
    windowUtil.setWindowHref('www.testwith.internal');
    expect(windowUtil.displayFeeSearch()).toBeTruthy();
  });

  it('should not activate fee search page with window href without .internal', () => {
    windowUtil.setWindowHref('www.testwith.com');
    expect(windowUtil.displayFeeSearch()).toBeFalsy();
  });

});
