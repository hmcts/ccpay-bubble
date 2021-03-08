import { AppComponent } from 'src/app/app.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PaymentGroupService } from 'src/app/services/payment-group/payment-group.service';
import { PaybubbleHttpClient } from 'src/app/services/httpclient/paybubble.http.client';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { instance, mock } from 'ts-mockito';
import { Meta } from '@angular/platform-browser';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Idle, IdleExpiry } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TimeoutNotificationsService } from './services/notification-service/notification-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgZone } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { PhaseBannerComponent } from 'src/app/shared/components/phase-banner/phase-banner.component';
import { SessionDialogComponent } from 'src/app/components/session-dialog/session-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {Observable} from 'rxjs/Rx';

const  userDetails: any = {
  sessionTimeout: {
  idleModalDisplayTime: 1,
  totalIdleTime: 2
  }
 };

const routerMock = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

const paybubbleHttpClientMock = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));

describe('AppComponent', () => {
    let appComponent: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let timeoutNotificationService: TimeoutNotificationsService;
    let paymentgrpservice: PaymentGroupService;
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ AppComponent, HeaderComponent, PhaseBannerComponent, SessionDialogComponent ],
          providers: [
            PaymentGroupService,
            TimeoutNotificationsService,
            { provide: Router, useValue: routerMock },
            { provide: Idle, useClass: Idle },
            { provide: Keepalive, useClass: Keepalive },
            { provide: PaybubbleHttpClient, useValue: paybubbleHttpClientMock },
          ],
          imports: [
            HttpClientModule,
            RouterModule,
            NgIdleKeepaliveModule,
            RouterTestingModule.withRoutes([])],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        appComponent = fixture.componentInstance;
        appComponent.isBulkscanningEnable = true;
        paymentgrpservice = TestBed.get(PaymentGroupService);
        // paymentgrpservice = fixture.debugElement.injector.get(PaymentGroupService);
        timeoutNotificationService = fixture.debugElement.injector.get(TimeoutNotificationsService);
        fixture.detectChanges();
      });

    // it('Truthy', () => {
    //     const flag = Boolean;
    //     this.flag = true;

    //       spyOn(paymentgrpservice, 'getBSFeature').and.returnValue(this.flag);
    //       appComponent.ngOnInit();
    //       fixture.detectChanges();

    //       expect(appComponent.isBulkscanningEnable).toEqual(flag);
    // });

    it('signOutHandler', () => {
        appComponent.signOutHandler();
        // expect(store.dispatch).toHaveBeenCalledTimes(2);
    });

    it('timeoutNotificationEventHandler throw Error for Invalidtype', () => {
        expect(() => appComponent.timeoutNotificationEventHandler({type: 'something'}))
        .toThrow(new Error('Invalid Timeout Notification Event'));
    });

    it('timeoutNotificationEventHandler signout', () => {
        const spyModal = spyOn(appComponent, 'updateTimeoutModal');
        appComponent.timeoutNotificationEventHandler({eventType: 'sign-out'});
        expect(spyModal).toHaveBeenCalledWith('0 seconds', false);
        // expect(store.dispatch).toHaveBeenCalledTimes(2);
    });

    it('timeoutNotificationEventHandler updateTimeoutModal', () => {
        const spyModal = spyOn(appComponent, 'updateTimeoutModal');
        appComponent.timeoutNotificationEventHandler({eventType: 'countdown', readableCountdown: '100 seconds'});
        expect(spyModal).toHaveBeenCalledWith('100 seconds', true);
    });

    // it('initTimeoutNotificationService', () => {
    //     appComponent.initTimeoutNotificationService(10, 100);
    //     expect(timeoutNotificationService.initialise).toHaveBeenCalledWith({
    //         idleModalDisplayTime: (10 * 60) * 1000,
    //         totalIdleTime: (100 * 60) * 1000,
    //         idleServiceName: 'idleSession',
    //       });
    // });

    it('staySignedInHandler', () => {
        const spyModal = spyOn(appComponent, 'updateTimeoutModal');
        appComponent.staySignedInHandler();
        expect(spyModal).toHaveBeenCalledWith(undefined, false);
    });

    it('updateTimeoutModal', () => {
        appComponent.updateTimeoutModal('100 seconds', false);
        expect(appComponent.timeoutModalConfig).toEqual({
            countdown: '100 seconds',
            isVisible: false
        });
    });

    it('timeoutNotificationEventHandler keepalive', () => {
        const spyModal = spyOn(appComponent, 'updateTimeoutModal');
        appComponent.timeoutNotificationEventHandler({eventType: 'keep-alive'});
        expect(spyModal).toHaveBeenCalled();
    });

    // it('addIdleServiceListener', () => {
    //     const spy = spyOn(appComponent, 'timeoutNotificationEventHandler');
    //     timeoutNotificationService.notificationOnChange.and.returnValue(of({}));
    //     appComponent.addTimeoutNotificationServiceListener();
    //     expect(timeoutNotificationService.notificationOnChange).toHaveBeenCalled();
    //     expect(spy).toHaveBeenCalledWith({});
    // });
});
