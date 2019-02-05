import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFeeDetailComponent } from './review-fee-detail.component';
import { Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddFeeDetailServiceMock } from '../test-mocks/add-fee-detail.service.mock';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';

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
      imports: [ RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ReviewFeeDetailComponent ],
      providers: [
        { provide: Location, useValue: LocationMock },
        { provide: AddFeeDetailService, useValue: AddFeeDetailServiceMock }
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
