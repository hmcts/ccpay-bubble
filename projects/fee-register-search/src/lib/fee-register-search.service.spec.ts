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
});
