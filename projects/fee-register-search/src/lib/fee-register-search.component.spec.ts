import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { FeeRegisterSearchComponent } from './fee-register-search.component';
import { FeeRegisterSearchService } from './services/fee-register-search/fee-register-search.service';
import { mockFees } from './mocks/mock-fees';

describe('FeeRegisterSearchComponent', () => {
  let component: FeeRegisterSearchComponent,
    fixture: ComponentFixture<FeeRegisterSearchComponent>,
    feeRegisterSearchService: FeeRegisterSearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeRegisterSearchComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientModule],
      providers: [FeeRegisterSearchService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeRegisterSearchComponent);
    component = fixture.componentInstance;
    feeRegisterSearchService = TestBed.get(FeeRegisterSearchService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit a fee', () => {
    component.selectFee(mockFees[0]);
    fixture.detectChanges();

    component.selectedFeeEvent.subscribe(emittedFee => {
      expect(emittedFee).toEqual(mockFees);
    });
  });

  it('Should set property fees on a successful http call', () => {
    spyOn(feeRegisterSearchService, 'getFees').and.returnValue(of(mockFees));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.fees).toEqual(mockFees);
  });

  it('Should set property error on an unsuccessful http call', () => {
    spyOn(feeRegisterSearchService, 'getFees').and.returnValue(throwError('Error'));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Error');
  });
});
