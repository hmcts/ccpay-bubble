import {FeeRegisterSearchService} from './fee-register-search.service';
import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FeeRegisterSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
        FeeRegisterSearchService,
        provideHttpClient(withInterceptorsFromDi()),
    ]
}));

  it('should be created', inject([FeeRegisterSearchService], (service: FeeRegisterSearchService) => {
    expect(service).toBeTruthy();
  }));
});
