import {FeeRegisterSearchService} from './fee-register-search.service';
import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('FeeRegisterSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
        FeeRegisterSearchService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ]
}));

  it('should be created', inject([FeeRegisterSearchService], (service: FeeRegisterSearchService) => {
    expect(service).toBeTruthy();
  }));
});
