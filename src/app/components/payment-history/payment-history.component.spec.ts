import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoryComponent } from './payment-history.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {Subject} from "rxjs";

describe('PaymentHistoryComponent', () => {
  let component: PaymentHistoryComponent;
  let fixture: ComponentFixture<PaymentHistoryComponent>;
  let activatedRoute: ActivatedRoute;
  let params: Subject<Params>;

  beforeEach(async(() => {
    params = new Subject<Params>();
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: params } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ccdCaseNumber = '1111-2222-3333-4444';
    component.apiRoot = 'api/payment-history';
    fixture.detectChanges();
    expect(component.apiRoot).toBe('api/payment-history');
    expect(component.ccdCaseNumber).toBe('1111-2222-3333-4444');
  });
});
