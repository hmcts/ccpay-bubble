import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeeSearchComponent } from './fee-search.component';

describe('Fee search component', () => {
  let component: FeeSearchComponent,
  fixture: ComponentFixture<FeeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeSearchComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
      ],
    });

    fixture = TestBed.createComponent(FeeSearchComponent);
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

  it('Search form should be valid if a non empty string has been entered', () => {
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue('test');
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
  });

  it('Should allow for searching of fees with "0" amount', () => {
    component.ngOnInit();
    component.searchForm.controls['searchInput'].setValue(0);
    component.searchFees();
    fixture.detectChanges();
    expect(component.hasErrors).toBeFalsy();
  });
});
