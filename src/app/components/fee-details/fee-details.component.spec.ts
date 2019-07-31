import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeeDetailsComponent} from './fee-details.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('FeeDetailsComponent', () => {
  let component: FeeDetailsComponent;
  let fixture: ComponentFixture<FeeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeeDetailsComponent],
      providers: [
        FormBuilder
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
