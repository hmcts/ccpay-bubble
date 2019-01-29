import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';
import { Location, LocationStrategy } from '@angular/common';

const LocationMock = {
  back() {
    return 'triggered.';
  }
};

describe('ReviewFeeDetailComponent', () => {
  let component: ReviewFeeDetailComponent;
  let fixture: ComponentFixture<ReviewFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFeeDetailComponent ],
      providers: [
        { provide: Location, useValue: LocationMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
