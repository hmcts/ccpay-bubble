import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed, ComponentFixture} from '@angular/core/testing';
import { FeeFilterComponent } from './fee-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeeRegisterSearchService } from '../../fee-register-search.service';
import { HttpClientModule } from '@angular/common/http';

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
      providers: [FeeRegisterSearchService]
    });

    fixture = TestBed.createComponent(FeeFilterComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  // it('Should emit correct jurisdiction array', () => {
  //   component.ngOnInit();
  //   component.filterForm.get('civil').setValue(true);
  //   component.applyFilter();
  //   fixture.detectChanges();
  //   component.jurisdictionsFilterEvent.subscribe(jurisdiction => {
  //     expect(jurisdiction).toEqual(['civil']);
  //   });
  // });
});
