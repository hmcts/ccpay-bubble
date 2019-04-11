import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ViewPaymentService } from './view-payment.service';

describe('PaymentLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ViewPaymentService,
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  it('should be created', inject([ViewPaymentService], (service: ViewPaymentService) => {
    expect(service).toBeTruthy();
  }));

  it('Should return a payment observable', inject([ViewPaymentService, XHRBackend], (service: ViewPaymentService, mockBackend) => {
    const mockResponse = {
      'amount': 5000,
      'currency': 'GBP'
    };

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    service.getPaymentDetail('123').subscribe(payment => {
      expect(payment).toEqual(mockResponse);
    });
  }));

  it('Should return an error observable', inject([ViewPaymentService, XHRBackend], (service: ViewPaymentService, mockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      connection.mockError(new Response(new ResponseOptions({
        status: 404,
        statusText: 'URL not Found',
      })));
    });

    service.getPaymentDetail('123').subscribe(
      () => { },
      (error) => {
        expect(error).toBe('Sorry, there was a problem with the service');
      });
  }));
});
