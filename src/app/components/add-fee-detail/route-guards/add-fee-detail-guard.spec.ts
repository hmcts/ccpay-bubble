// import { instance, mock } from 'ts-mockito/lib/ts-mockito';
// import { ConfirmationGuard } from 'src/app/components/confirmation/route-guards/confirmation-guard.service';
// import { WindowUtil } from 'src/app/services/window-util/window-util';

// describe('Fee Search route guard', () => {
//   let feeSearchGuard: FeeSearchGuard;
//   let windowUtil: WindowUtil;

//   beforeEach(() => {
//     windowUtil = new WindowUtil();
//     feeSearchGuard = new FeeSearchGuard(windowUtil);
//   });

//   it('should activate fee search page with window href .internal', () => {
//     windowUtil.setWindowHref('www.testwith.internal');
//     expect(feeSearchGuard.canActivate()).toBeTruthy();
//   });

//   it('should not activate fee search page with window href without .internal', () => {
//     windowUtil.setWindowHref('www.testwith.com');
//     expect(feeSearchGuard.canActivate()).toBeFalsy();
//   });

// });
