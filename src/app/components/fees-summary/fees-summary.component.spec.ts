import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FeesSummaryComponent } from './fees-summary.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const routerMock = {
  navigate: jasmine.createSpy('navigate')
};

describe('Fees Summary component', () => {
  let component: FeesSummaryComponent,
  fixture: ComponentFixture<FeesSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeesSummaryComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({reference: '2019-15578475904'})
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeesSummaryComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });
});
