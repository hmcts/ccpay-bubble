import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeeListComponent } from './fee-list.component';
import { FilterFeesPipe } from '../../pipes/filter-fees.pipe';
import { mockFees } from '../../mock-fees';

describe('Fee list component', () => {
  let component: FeeListComponent,
    fixture: ComponentFixture<FeeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FeeListComponent,
        FilterFeesPipe
      ],
      imports: [CommonModule],
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
});
