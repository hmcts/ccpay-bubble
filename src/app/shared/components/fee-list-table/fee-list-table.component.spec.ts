import { FeeListTableComponent } from 'src/app/shared/components/fee-list-table/fee-list-table.component';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { FeeModel } from 'src/app/models/FeeModel';

describe('Fee list table', () => {
  let component: FeeListTableComponent;
  let fixture: ComponentFixture<FeeListTableComponent>;
  const fee: FeeModel = new FeeModel();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeListTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fee.calculated_amount = 100;
  });

  it('Should accept input of fees', () => {
    component.fees = [fee];
    fixture.detectChanges();
    expect(component.fees[0].calculated_amount).toBe(100);
  });

  it('Should emit selected fee', () => {
    spyOn(component.feeChangedEventEmitter, 'emit');
    component.selectFee(fee);
    fixture.detectChanges();
    expect(component.feeChangedEventEmitter.emit).toHaveBeenCalledWith(fee);
  });
});
