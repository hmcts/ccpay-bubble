import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieTableComponent } from './cookie-table.component';

describe('CookieTableComponentTest', () => {
  @Component({
    selector: `app-host-dummy-component`,
    template: `<app-cookie-details/>`
  })
  class TestDummyHostComponent {
    public cookiePolicy: CookieTableComponent;
  }
  const testHostComponent = TestDummyHostComponent;
  let component: CookieTableComponent;
  let fixture: ComponentFixture<CookieTableComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ CookieTableComponent ],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });
});
