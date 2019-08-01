import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CcdSearchComponent } from './ccd-search.component';
import { Router, RouterModule , ActivatedRoute} from '@angular/router';
import { of } from 'rxjs';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('Fee search component', () => {
  let component: CcdSearchComponent,
  fixture: ComponentFixture<CcdSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcdSearchComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            snapshot: {
              queryParams: {
                takePayment: true
              }
            }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(CcdSearchComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should initialise the search input to an empty string', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.searchForm.get('searchInput').value).toBe('');
  });

  it('Search form should be invalid if an empty string has been entered', () => {
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue('');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be invalid if a wrong format string has been entered', () => {
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue('test');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeTruthy();
  });

  it('Search form should be valid if a correct format string has been entered', () => {
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?view=case-transactions&takePayment=true');
  });

  it('Should remove hyphems from ccd_case_number', () => {
    let ccd_case_number = '1111-2222-3333-4444';
    ccd_case_number = component.removeHyphenFromString(ccd_case_number);
    expect(ccd_case_number).toBe('1111222233334444');
  });
});
