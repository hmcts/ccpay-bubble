import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PaymentGroupService } from './services/payment-group/payment-group.service';
import { TimeoutNotificationsService} from './services/notification-service/notification-service';
import {propsExist} from 'src/app/utilities/util';

declare var gtag;
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 title = 'ccpay-bubble';
 isBulkscanningEnable = true;
 // isUserTimedOut: Boolean;
 public  userDetails: any = {
   sessionTimeout: {
   idleModalDisplayTime: 1,
   totalIdleTime: 2
   }
  };

  public timeoutModalConfig = {
    countdown: '0 seconds',
    isVisible: false,
  };

 constructor (
   router: Router,
   private paymentGroupService: PaymentGroupService,
   private readonly timeoutNotificationsService: TimeoutNotificationsService
   ) {
    this.userDetailsHandler(this.userDetails);
  // //  const navEndEvents = router.events.pipe (
  // //    filter(event => event instanceof NavigationEnd)
  // //  );
  // //  navEndEvents.subscribe((event: NavigationEnd) => {
  // //    gtag('config', 'UA-146285829-2', {'page_path': event.urlAfterRedirects} );
  // //  });
   }
   ngOnInit() {
    // this.paymentGroupService.getBSFeature().then((status) => {
    //   this.isBulkscanningEnable = status;
    // });
    this.isBulkscanningEnable = true;
  }

  // userTimeOut(event:any) {
  //   this.isUserTimedOut = event;
  //   if (this.isUserTimedOut) {
  //     alert("hello");
  //     const { idleModalDisplayTime, totalIdleTime } = this.userDetails.sessionTimeout;
  //     this.addTimeoutNotificationServiceListener();
  //     this.initTimeoutNotificationService(idleModalDisplayTime, totalIdleTime);
  //   }
  // }

  public userDetailsHandler(userDetails) {

    if (propsExist(userDetails, ['sessionTimeout'] ) && userDetails.sessionTimeout.totalIdleTime > 0) {

      console.log(userDetails.sessionTimeout);
      const { idleModalDisplayTime, totalIdleTime } = userDetails.sessionTimeout;
      this.addTimeoutNotificationServiceListener();
      this.initTimeoutNotificationService(idleModalDisplayTime, totalIdleTime);
    }
  }

  /**
   * Add Timeout Notification Service Listener
   *
   * We listen for Timeout Notification Service events.
   */
  public addTimeoutNotificationServiceListener() {

    this.timeoutNotificationsService.notificationOnChange().subscribe(event => {
      this.timeoutNotificationEventHandler(event);
    });
  }

  /**
   * Timeout Notification Event Handler
   *
   * The Timeout Notification Service currently has three events that we can handle. These are:
   *
   * The 'countdown' event. This event dispatches a readable countdown timer in it's event payload. the countdown
   * timer is a readable version of the countdown time ie. '10 seconds' or '1 minute'. Note that this dispatches
   * once per second when the timer has reached less than 60 seconds till the 'sign-out' event is fired.
   *
   * If the 'countdown' timer is above a minute this event is dispatched every minute.
   *
   * The 'keep-alive' event dispatches when the User has interacted with the page again.
   *
   * The 'sign-out' event dispatches when the countdown timer has come to an end - when the User
   * should be signed out.
   *
   * @param event - {
   *  eventType: 'countdown'
   *  readableCountdown: '42 seconds',
   * }
   */
  public timeoutNotificationEventHandler(event) {
    switch (event.eventType) {
      case 'countdown': {
        this.updateTimeoutModal(event.readableCountdown, true);
        return;
      }
      case 'sign-out': {
        this.updateTimeoutModal('0 seconds', false);

        console.log('sign-out');
       // this.store.dispatch(new fromRoot.StopIdleSessionTimeout());
        // this.store.dispatch(new fromRoot.IdleUserLogOut());
        return;
      }
      case 'keep-alive': {
        this.updateTimeoutModal('0 seconds', false);
        return;
      }
      default: {
        throw new Error('Invalid Timeout Notification Event');
      }
    }
  }

  /**
   * Set Modal
   *
   * Set the modal countdown, and if the modal is visible to the User.
   */
  public updateTimeoutModal(countdown: string, isVisible: boolean): void {
    this.timeoutModalConfig = {
        countdown,
        isVisible
    };
  }

  /**
   * Stay Signed in Handler
   */
  public staySignedInHandler() {

    this.updateTimeoutModal(undefined, false);
  }

  public signOutHandler() {

   // this.store.dispatch(new fromRoot.StopIdleSessionTimeout());
    // this.store.dispatch(new fromRoot.Logout());
  }

  /**
   * Initialise Timeout Notficiation Service
   * <code>totalIdleTime</code> is the total amount of time in minutes that the User is idle for.
   * The Users total idle time, includes the time in which we show the Session Timeout Modal to the User
   *
   * <code>idleModalDisplayTime</code> is the total amount of time in minutes to display the Session Timeout Modal.
   *
   * Important note: The idleModalDisplayTime IS PART of the totalIdleTime. The idleModalDisplayTime does not get added to the end of
   * the totalIdleTime.
   *
   * We convert idleModalDisplayTime and totalIdleTime which reaches here in minutes to seconds.
   *
   * @param idleModalDisplayTime - Should reach here in minutes
   * @param totalIdleTime - Should reach here in minutes
   */
  public initTimeoutNotificationService(idleModalDisplayTime, totalIdleTime) {

    const idleModalDisplayTimeInSeconds = idleModalDisplayTime * 60;
    const idleModalDisplayTimeInMilliseconds = idleModalDisplayTimeInSeconds * 1000;

    const totalIdleTimeInMilliseconds = (totalIdleTime * 60) * 1000;

    const timeoutNotificationConfig: any = {
      idleModalDisplayTime: idleModalDisplayTimeInMilliseconds,
      totalIdleTime: totalIdleTimeInMilliseconds,
      idleServiceName: 'idleSession'
    };

    this.timeoutNotificationsService.initialise(timeoutNotificationConfig);
  }

}
