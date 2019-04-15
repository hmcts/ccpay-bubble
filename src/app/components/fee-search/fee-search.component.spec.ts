import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FeeSearchComponent } from './fee-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
  fixture: ComponentFixture<FeeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should assign selected fee', () => {
    component.logFee('test');
    fixture.detectChanges();
    expect(component.selectedFee).toBe('test');
  });
});
