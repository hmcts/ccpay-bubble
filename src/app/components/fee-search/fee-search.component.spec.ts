import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FeeSearchComponent} from './fee-search.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaybubbleHttpClient} from '../../services/httpclient/paybubble.http.client';
import {instance, mock} from 'ts-mockito';
import {HttpClient} from '@angular/common/http';
import {Meta} from '@angular/platform-browser';

fdescribe('Fee search component', () => {
  let component: FeeSearchComponent,
    fixture: ComponentFixture<FeeSearchComponent>,
    paymentGroupService: PaymentGroupService,
    routerService: any,
    activatedRoute: any,
    router: Router;

  beforeEach(() => {
    activatedRoute = {
      params: {
        subscribe: (fun) => fun()
      },
      snapshot: {
        queryParams: {
          'ccdCaseNumber': '1234-1234-1234-1234'
        }
      }
    };
    routerService = {
      navigateByUrl: () => true
    };
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provide: Router, useValue: routerService},
        {
          provide: PaymentGroupService,
          useValue: new PaymentGroupService(new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta))))
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
    spyOn(paymentGroupService, 'postPaymentGroup').and.returnValue({then: (fun) => fun({payment_group_reference: '2019-12341234'})});
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should pass selected fee into POST call for backend', () => {
    component.selectFee('test');
    fixture.detectChanges();
    expect(paymentGroupService.postPaymentGroup).toHaveBeenCalledWith('test');
  });

  it('Should set ccd number from URL', async(async () => {
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  it('Should navigate to fee-summary page using correct CCD case number and payment group reference', async(async () => {
    spyOn(router, 'navigateByUrl');
    component.selectFee({});
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&paymentGroupRef=2019-12341234');
  }));
});
