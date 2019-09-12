import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CcdSearchComponent } from './ccd-search.component';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CaseRefService } from '../../services/caseref/caseref.service';
import { PaybubbleHttpClient } from '../../services/httpclient/paybubble.http.client';
import { PaymentGroupService } from '../../services/payment-group/payment-group.service';
import { instance, mock } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

const paybubbleHttpClientMock = new PaybubbleHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));

describe('Fee search component', () => {
  let component: CcdSearchComponent,
  fixture: ComponentFixture<CcdSearchComponent>;
  let caseRefService: CaseRefService,
      paymentGroupService: PaymentGroupService;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcdSearchComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        CaseRefService,
        PaymentGroupService,
        { provide: PaybubbleHttpClient, useValue: paybubbleHttpClientMock },
        { provide: Router, useValue: routerMock },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ActivatedRoute,
          useValue: {
            params: of({ccdCaseNumber: '1111-2222-3333-4444'}),
            routeConfig: {
              path: 'ccd-search'
            },
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
        component.searchForm = formBuilder.group({
            CCDorException: null
        });
    caseRefService = fixture.debugElement.injector.get(CaseRefService);
    paymentGroupService = fixture.debugElement.injector.get(PaymentGroupService);
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
    spyOn(caseRefService, 'validateCaseRef').and.callFake(() => of({}));
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue('1111-2222-3333-4444');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
    expect(component.dcnNumber).toBe(null);
    expect(component.ccdCaseNumber).toBe('1111222233334444');

    // tslint:disable-next-line:max-line-length
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/payment-history/1111222233334444?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true');
  });

  it('Should remove hyphems from ccd_case_number', () => {
    let ccd_case_number = '1111-2222-3333-4444';
    ccd_case_number = component.removeHyphenFromString(ccd_case_number);
    expect(ccd_case_number).toBe('1111222233334444');
  });


  it('Should set selected radio button category', () => {
    const selectedValue = 'DCN';

    component.onSelectionChange(selectedValue);
    expect(component.selectedValue).toBe('DCN');
    expect(component.searchForm.get('CCDorException').value).toBe('DCN');
  });
});
