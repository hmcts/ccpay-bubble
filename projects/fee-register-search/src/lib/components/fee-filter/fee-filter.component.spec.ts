import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import { FeeFilterComponent } from './fee-filter.component';
import { FormsModule, ReactiveFormsModule, CheckboxRequiredValidator } from '@angular/forms';
import { FeeRegisterSearchService } from '../../fee-register-search.service';
import { HttpClientModule } from '@angular/common/http';
import { Jurisdictions } from '../../models/Jurisdictions';
import { MockFeeRegisterSearchService } from '../../mock-fee-register-search.service';

describe('Fee Filter component', () => {
  let component: FeeFilterComponent,
    fixture: ComponentFixture<FeeFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FeeFilterComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FeeRegisterSearchService, useClass: MockFeeRegisterSearchService }
      ]
    });

    fixture = TestBed.createComponent(FeeFilterComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit correct jurisdiction array', () => {
    component.ngOnInit();
    component.filterForm.get('jurisdiction1').setValue('civil');
    component.filterForm.get('jurisdiction2').setValue('family court');
    component.applyFilter();
    fixture.detectChanges();
    const emitJurisdiction = new Jurisdictions();
    emitJurisdiction.jurisdiction1 = 'civil';
    emitJurisdiction.jurisdiction2 = 'family court';
    component.jurisdictionsFilterEvent.subscribe(jurisdiction => {
      expect(jurisdiction).toEqual(emitJurisdiction);
    });
  });

  it('Should toggle correct jurisdiction', () => {
    component.ngOnInit();
    component.jurisdictionData.jurisdiction1.show = true;
    component.toggleJurisdiction(component.jurisdictionData.jurisdiction1);
    expect(component.jurisdictionData.jurisdiction1.show).toBeFalsy();
  });
});
