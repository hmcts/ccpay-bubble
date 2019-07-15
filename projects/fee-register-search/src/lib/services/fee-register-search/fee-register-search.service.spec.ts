import {FeeRegisterSearchService} from './fee-register-search.service';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

describe('FeeRegisterSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      FeeRegisterSearchService,
    ]
  }));

  it('should be created', inject([FeeRegisterSearchService], (service: FeeRegisterSearchService) => {
    expect(service).toBeTruthy();
  }));
});
