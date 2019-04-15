import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FeeListComponent } from './fee-list.component';
import { mockFee } from '../../mock-fee';

describe('Fee list component', () => {
  let component: FeeListComponent,
    fixture: ComponentFixture<FeeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeListComponent],
      imports: [CommonModule]
    });

    fixture = TestBed.createComponent(FeeListComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should emit a fee', () => {
    component.selectFee(mockFee[0]);
    fixture.detectChanges();

    component.selectedFeeEvent.subscribe(emittedFee => {
      expect(emittedFee).toEqual(mockFee[0]);
    });
  });
});
