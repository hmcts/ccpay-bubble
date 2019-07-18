import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FeeSearchComponent} from './fee-search.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PaymentGroupService} from '../../services/payment-group/payment-group.service';
import {MockPaymentGroupService} from '../../../../projects/fee-register-search/src/lib/mocks/mock-payment-group-service';
import {ActivatedRoute, Router} from '@angular/router';
import {MockActivatedRouteService} from '../../../../projects/fee-register-search/src/lib/mocks/mock-activated-route-service';
import {MockRouterService} from '../../../../projects/fee-register-search/src/lib/mocks/mock-router-service';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
    fixture: ComponentFixture<FeeSearchComponent>,
    router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      providers: [
        {provide: ActivatedRoute, useClass: MockActivatedRouteService},
        {provide: Router, useClass: MockRouterService},
        {provide: PaymentGroupService, useClass: MockPaymentGroupService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should assign selected fee', () => {
    component.selectFee('test');
    fixture.detectChanges();
    expect(component.selectedFee).toBe('test');
  });

  it('Should set ccd number from URL', async(async () => {
    component.ngOnInit();
    expect(component.ccdNo).toBe('1234-1234-1234-1234');
  }));

  it('Should set ccd number from URL', async(async () => {
    component.ngOnInit();
    spyOn(router, 'navigateByUrl');
    component.selectFee({});
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith('/payment-history/1234-1234-1234-1234?view=fee-summary&paymentGroupRef=2019-12341234');
  }));
});
