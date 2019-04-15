import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { XHRBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FeeRegisterSearchService } from './fee-register-search.service';
import { mockFee } from './mock-fee';

describe('FeeRegisterSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      FeeRegisterSearchService,
      { provide: XHRBackend, useClass: MockBackend },
    ]
  }));

  it('should be created', inject([FeeRegisterSearchService], (service: FeeRegisterSearchService) => {
    expect(service).toBeTruthy();
  }));

  it('Should return a fee observable', inject([FeeRegisterSearchService, XHRBackend], (service: FeeRegisterSearchService, mockBackend) => {
     mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockFee)
      })));
    });

     service.getFees().subscribe(fee => {
      expect(fee).toEqual(mockFee);
    });
  }));

  it('Should return an error observable',
    inject([FeeRegisterSearchService, XHRBackend], (service: FeeRegisterSearchService, mockBackend) => {
    mockBackend.connections.subscribe((connection) => {
      connection.mockError(new Response(new ResponseOptions({
        status: 404,
        statusText: 'URL not Found',
      })));
    });

     service.getFees().subscribe(
      () => { },
      (error) => {
        expect(error).toEqual('Sorry, there was a problem getting fees');
      });
  }));
});
