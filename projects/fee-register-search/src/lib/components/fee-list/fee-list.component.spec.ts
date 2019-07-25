import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgxPaginationModule} from 'ngx-pagination';
import {FeeListComponent} from './fee-list.component';
import {FilterFeesPipe} from '../../pipes/filter-fees.pipe';
import {By} from '@angular/platform-browser';
import { mockFees } from '../../mocks/mock-fees';

describe('Fee list component', () => {
  let component: FeeListComponent,
    fixture: ComponentFixture<FeeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FeeListComponent,
        FilterFeesPipe
      ],
      imports: [
        CommonModule,
        NgxPaginationModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FeeListComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit a fee', () => {
    component.selectFee(mockFees[0]);
    fixture.detectChanges();

    component.selectedFeeEvent.subscribe(emittedFee => {
      expect(emittedFee).toEqual(mockFees[0]);
    });
  });

  it('Should display the current live version of the fee', () => {
    fixture.componentInstance.fees = mockFees;
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('.fee-current-version-amount'));
    expect(debugElement[0].nativeElement.innerText).toEqual('£10,000.00');
  });
});
