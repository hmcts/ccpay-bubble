import { TestBed } from '@angular/core/testing';

import { FeepayTitleService } from './feepay.title.service';
import { ActivatedRoute} from "@angular/router";

describe('TitleService', () => {
  let service: FeepayTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                takePayment: 'true'
              }
            }
          }
        }
      ]
    });
    service = TestBed.inject(FeepayTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set Service Requests', () => {
    service.setTitleFromQueryParams('true', 'true', 'reports')
    const title = service.getTitle();
    expect(title).toBe ('Service Requests');
  });

  it('should set Case Transactions', () => {
    service.setTitleFromQueryParams('false', 'true', 'reports')
    const title = service.getTitle();
    expect(title).toBe ('Case Transactions');
  });

  it('should set Reports', () => {
    service.setTitleFromQueryParams('false', 'false', 'reports')
    const title = service.getTitle();
    expect(title).toBe ('Reports');
  });

  it('should set Payment History', () => {
    service.setTitleFromQueryParams('false', 'false', '')
    const title = service.getTitle();
    expect(title).toBe ('Payment History');
  });
});
