import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FeesSummaryComponent } from './fees-summary.component';
import { Router } from '@angular/router';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('Fees Summary component', () => {
  let component: FeesSummaryComponent,
  fixture: ComponentFixture<FeesSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeesSummaryComponent],
      providers: [{ provide: Router, useValue: routerMock }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeesSummaryComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

});
