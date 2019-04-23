import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ViewPaymentService } from './view-payment.service';
import { ViewPaymentComponent } from './view-payment.component';

describe('View payment component', () => {
  let component: ViewPaymentComponent;
  let fixture: ComponentFixture<ViewPaymentComponent>;
  let testBedService: ViewPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPaymentComponent],
      imports: [HttpClientModule],
      providers: [ViewPaymentService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ViewPaymentComponent);
    component = fixture.componentInstance;
    testBedService = TestBed.get(ViewPaymentService);
  });

  it('Should assign property payment with a payment object on successful service call', () => {
    const payment = {
      amount: 5000,
      currency: 'GBP'
    };

    spyOn(testBedService, 'getPaymentDetail').and.returnValue(of(payment));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.payment).toEqual(payment);
  });

  it('Should assign property errorMessage with an error string on unsuccessful service call', () => {
    spyOn(testBedService, 'getPaymentDetail').and.returnValue(throwError('Error'));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error');
  });
});
