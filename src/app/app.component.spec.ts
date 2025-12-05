import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { PaymentGroupService } from './services/payment-group/payment-group.service';

describe('AppComponent', () => {
  class RouterStub {
    public events = new Subject<Event>();
  }

  let documentStub: Document;
  let paymentGroupServiceSpy: jasmine.SpyObj<PaymentGroupService>;
  let routerStub: RouterStub;

  beforeEach(async () => {
    documentStub = {
      documentElement: { lang: '' } as any
    } as Document;

    paymentGroupServiceSpy = jasmine.createSpyObj('PaymentGroupService', ['getBSFeature']);
    paymentGroupServiceSpy.getBSFeature.and.returnValue(Promise.resolve(true));

    routerStub = new RouterStub();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: PaymentGroupService, useValue: paymentGroupServiceSpy },
        { provide: DOCUMENT, useValue: documentStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    (window as any).dataLayer = [];
  });

  afterEach(() => {
    delete (window as any).dataLayer;
  });

  it('pushes virtual page view events into the dataLayer when navigation ends', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const event = new NavigationEnd(1, '/start', '/after');
    routerStub.events.next(event);

    expect((window as any).dataLayer).toContain(jasmine.objectContaining({
      event: 'virtualPageview',
      page_path: '/after'
    }));
  });

  it('sets the document language to English on init', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    await fixture.whenStable();

    expect(documentStub.documentElement.lang).toBe('en');
  });
});
