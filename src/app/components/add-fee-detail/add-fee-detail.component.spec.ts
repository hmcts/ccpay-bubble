import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AddFeeDetailComponent } from './add-fee-detail.component';
import { AddFeeDetailServiceMock } from '../test-mocks/add-fee-detail.service.mock';
import { AddFeeDetailService } from 'src/app/services/add-fee-detail/add-fee-detail.service';

describe('AddFeeDetailComponent', () => {
  let component: AddFeeDetailComponent;
  let fixture: ComponentFixture<AddFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFeeDetailComponent ],
      providers: [
        { provide: AddFeeDetailService, useValue: AddFeeDetailServiceMock }
      ],
      imports: [FormsModule, RouterModule, RouterTestingModule.withRoutes([])]
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
