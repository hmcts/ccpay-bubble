import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeeDetailComponent } from './add-fee-detail.component';

describe('AddFeeDetailComponent', () => {
  let component: AddFeeDetailComponent;
  let fixture: ComponentFixture<AddFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleHwfFields', () => {
    component.hwfEntryOn = false;
    component.toggleHwfFields();
    expect(component.hwfEntryOn).toBeTruthy();
  });
});
