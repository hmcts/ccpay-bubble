import { Component } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';

describe('Service failure component', () => {
  @Component({
    selector: `app-host-dummy-component`,
    template: `<app-service-failure/>`
  })
  class TestDummyHostComponent {
    public serviceFailure: ServiceFailureComponent;
  }
  const testHostComponent = TestDummyHostComponent;
  let component: ServiceFailureComponent;
  let fixture: ComponentFixture<ServiceFailureComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      imports: [
        ServiceFailureComponent,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
