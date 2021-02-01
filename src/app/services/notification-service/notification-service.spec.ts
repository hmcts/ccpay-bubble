import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { TimeoutNotificationsService } from 'src/app/services/notification-service/notification-service';
import {TimeoutNotificationConfig} from 'src/app/models/timeout-notification.model';
import { Observable, of } from 'rxjs';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpHeaders } from '@angular/common/http';

describe('Notification Service', () => {
  let timeoutNotificationService: TimeoutNotificationsService;
  // let timeoutConfig: TimeoutNotificationConfig;
  // let meta: Meta;
  // let http: HttpClient;
  const options: any = {};
  // const mockPost = (url, body, opts) => of(opts);
  // const {idleServiceName, idleModalDisplayTime, totalIdleTime} = timeoutConfig;
  const timeoutNotificationConfig: any = {
    idleModalDisplayTime: '5',
    totalIdleTime: '2',
    idleServiceName: 'idleSession'
  };

  beforeEach(() => {
    timeoutNotificationService = jasmine.createSpyObj('TimeoutNotificationsService', ['notificationOnChange', 'initialise']);
  });

  it('Should call Notification inititalization method', () => {
    timeoutNotificationService.initialise(timeoutNotificationConfig);
     expect(timeoutNotificationService.initialise).toHaveBeenCalledWith({
               idleModalDisplayTime: '5',
               totalIdleTime: '2',
               idleServiceName: 'idleSession',
             });
  });

  // it('Should call Notification millisecondsToSeconds method', () => {
  //   timeoutNotificationService.millisecondsToSeconds(timeoutNotificationConfig.idleModalDisplayTime);
  //   expect(timeoutNotificationService.millisecondsToSeconds(timeoutNotificationConfig.idleModalDisplayTime)).toHaveBeenCalled();
  // });

//    it('addIdleServiceListener', () => {
//     const spy = spyOn(TimeoutNotificationsService, 'timeoutNotificationEventHandler');
//     timeoutNotificationService.notificationOnChange.and.returnValue(of({}));
//     appComponent.addTimeoutNotificationServiceListener();
//     expect(timeoutNotificationService.notificationOnChange).toHaveBeenCalled();
//     expect(spy).toHaveBeenCalledWith({});
//   });

});
