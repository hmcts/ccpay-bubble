import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';

describe('ReviewFeeDetailComponent', () => {
  let component: ReviewFeeDetailComponent;
  let fixture: ComponentFixture<ReviewFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFeeDetailComponent ]
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
