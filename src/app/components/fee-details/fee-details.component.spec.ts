import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeeDetailsComponent } from './fee-details.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('FeeDetailsComponent', () => {
  let component: FeeDetailsComponent;
  let fixture: ComponentFixture<FeeDetailsComponent>;
  let testFeeVersions: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeeDetailsComponent],
      providers: [FormBuilder],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    testFeeVersions = {
      version: 1,
      calculatedAmount: 0,
      memo_line: 'test-memoline',
      natural_account_code: '1234-1234-1234-1234',
      flat_amount: { amount: 12340 },
      description: 'test-description'
    };

    fixture = TestBed.createComponent(FeeDetailsComponent);
    component = fixture.componentInstance;
    component.fee = {
      code: 'test-code',
      fee_type: 'banded',
      fee_versions: [
        {
          description: 'Recovery order (section 50)',
          status: 'approved',
          author: '126172',
          approvedBy: '126175',
          version: 1,
          valid_from: '2014-04-21T00:00:00.000+0000',
          valid_to: '2014-04-21T00:00:00.000+0000',
          flat_amount: { amount: 215 },
          memo_line: 'RECEIPT OF FEES - Family misc private',
          statutory_instrument: '2014 No 877 ',
          si_ref_id: '2.1q',
          natural_account_code: '4481102174',
          fee_order_name: 'Family Proceedings',
          direction: 'cost recovery'
        }
      ],
      current_version: {
        version: 1,
        calculatedAmount: 1234,
        memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: { amount: 1234 },
        description: 'test-description'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should restart search event ongoback', () => {
    spyOn(component.restartSearchEvent, 'emit');
    component.goBack();
    expect(component.restartSearchEvent.emit).toHaveBeenCalled();
  });

  it('ngOnChanges should synchronously populate validOldVersionArray', () => {
    component.ngOnChanges();
    expect(component.validOldVersionArray).toBeDefined();
  });

  it('Should submit fee volume', () => {
    const expected = Object({ volumeAmount: 1, selectedVersionEmit: undefined, isDiscontinuedFeeAvailable: false });
    spyOn(component.submitFeeVolumeEvent, 'emit');
    component.submitVolume();
    expect(component.submitFeeVolumeEvent.emit).toHaveBeenCalledWith(expected);
  });

  it('Should submit fee volume with feeversion', () => {
    spyOn(component.submitFeeVolumeEvent, 'emit');
    const expected = Object({
      volumeAmount: 1,
      selectedVersionEmit: {
        version: 1, calculatedAmount: 0, memo_line: 'test-memoline',
        natural_account_code: '1234-1234-1234-1234',
        flat_amount: { amount: '0' }, description: 'test-description'
      },
      isDiscontinuedFeeAvailable: false
    });
    component.getSelectedFeesVersion(testFeeVersions);
    component.submitVolume();
    expect(component.submitFeeVolumeEvent.emit).toHaveBeenCalledWith(expected);
  });

  it('Should get volume_amount if volume_amount available', () => {
    const feeVersion: any = { volume_amount: {}, description: 'test' };
    expect(component.getAmountFromFeeVersion(feeVersion)).toBe(feeVersion['volume_amount'].amount);
  });

  it('Should get flat_amount if flat_amount available', () => {
    const feeVersion: any = { flat_amount: { amount: 5 }, description: 'test' };
    expect(component.getAmountFromFeeVersion(feeVersion)).toBe(5);
  });

  it('Should get percentage_amount if percentage_amount available', () => {
    const feeVersion: any = { percentage_amount: { percentage: 10 }, description: 'test' };
    expect(component.getAmountFromFeeVersion(feeVersion)).toBe(10);
  });

  it('Should return false if there is no valid_to and valid_from value', () => {
    const feeVersion: any = { percentage_amount: { percentage: 10 } };
    expect(component.getValidFeeVersionsBasedOnDate(feeVersion)).toBe(false);
  });

  it('Should return false if valid_to is old and no valid_from', () => {
    const feeVersion: any = { valid_to: '2020-05-10', percentage_amount: { percentage: 10 } };
    expect(component.getValidFeeVersionsBasedOnDate(feeVersion)).toBe(false);
  });

  it('Should return false if valid_from is old and valid_to is empty', () => {
    const feeVersion: any = { valid_from: '2020-05-10', valid_to: '', percentage_amount: { percentage: 10 } };
    expect(component.getValidFeeVersionsBasedOnDate(feeVersion)).toBe(false);
  });

  it('Should return false if valid_from and valid_to are both older than six months', () => {
    const feeVersion: any = { valid_from: '2019-05-10', valid_to: '2020-01-01', percentage_amount: { percentage: 10 } };
    expect(component.getValidFeeVersionsBasedOnDate(feeVersion)).toBe(false);
  });

  it('Should return only previous version when current version is within six months', () => {
    const recentDate = new Date();
    recentDate.setMonth(recentDate.getMonth() - 1);
    const recentDateString = recentDate.toISOString();

    const prevVersionDate = new Date(recentDate);
    prevVersionDate.setMonth(prevVersionDate.getMonth() - 3);
    const prevVersionDateString = prevVersionDate.toISOString();

    component.fee = {
      code: 'FEE0001', fee_type: 'banded',
      fee_versions: [
        { description: 'd1', status: 'approved', author: 'a1', approvedBy: 'b1', version: 1,
          valid_from: '2019-11-04T13:18:31.550+0000', valid_to: '2020-11-04T13:18:31.550+0000',
          flat_amount: { amount: 0.50 }, memo_line: 'm1', statutory_instrument: '2014 No 874',
          si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced' },
        { description: 'd2', status: 'approved', author: 'a2', approvedBy: 'b2', version: 3,
          valid_from: '2019-11-04T00:00:00.000+0000', valid_to: '2020-11-04T00:00:00.000+0000',
          flat_amount: { amount: 90.00 }, memo_line: 'm2', statutory_instrument: '2014 No 874',
          si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced' },
        { description: 'd3', status: 'approved', author: 'a3', approvedBy: 'b3', version: 4,
          valid_from: '2019-11-04T00:00:00.000+0000', valid_to: '2020-11-04T00:00:00.000+0000',
          flat_amount: { amount: 120.00 }, memo_line: 'm3', statutory_instrument: '2014 No 874',
          si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced' },
        // v6 has a recent valid_to so it passes the 6-month date filter
        { description: 'd4', status: 'approved', author: 'a', approvedBy: 'b4', version: 6,
          valid_from: prevVersionDateString, valid_to: recentDateString,
          flat_amount: { amount: 150.00 }, memo_line: 'm4', statutory_instrument: '2020 No 786',
          si_ref_id: '2020.B', natural_account_code: '20202020', fee_order_name: 'DEMO ORDER 2020', direction: 'enhanced' }
      ],
      current_version: {
        version: 7, valid_from: recentDateString, status: 'approved',
        memo_line: 'memoline-current', natural_account_code: '1234-1234-1234-1234',
        flat_amount: { amount: 526 }, description: 'test-description-current'
      }
    };

    const result = component.validOldFeesVersions(component.fee);
    expect(result).toEqual([
      jasmine.objectContaining({ version: 6, flat_amount: jasmine.objectContaining({ amount: 150.00 }) })
    ]);
  });

  it('Should return true if current version is undefined (within date range)', () => {
    component.fee = {
      code: 'FEE0001', fee_type: 'banded',
      fee_versions: [
        { description: 'd1', status: 'approved', author: 'a1', approvedBy: 'b1', version: 1,
          valid_from: '2020-11-04T13:18:31.550+0000', valid_to: '2021-02-04T13:18:31.550+0000',
          flat_amount: { amount: 0.50 }, memo_line: 'm1', statutory_instrument: '2014 No 874',
          si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced' }
      ]
    };
    component.validOldFeesVersions(component.fee);
    component.submitVolume();
    expect(component.fee.fee_versions.length).toBe(1);
    expect(component.fee.current_version).toBeUndefined();
    expect(component.validOldVersionArray.length).toBe(0);
  });

  it('Should keep historical version when current version is within six months', () => {
    const recentDate = new Date();
    recentDate.setMonth(recentDate.getMonth() - 1);
    const recentDateString = recentDate.toISOString();

    const oldVersion = {
      description: 'old', status: 'approved', version: 1,
      valid_from: '2019-01-01T00:00:00.000+0000', valid_to: recentDateString,
      flat_amount: { amount: 300.00 }
    };
    const currentVersion = {
      description: 'current', status: 'approved', version: 2,
      valid_from: recentDateString, valid_to: null, flat_amount: { amount: 526.00 }
    };

    component.fee = {
      code: 'FEE0219', fee_type: 'ranged',
      fee_versions: [oldVersion, currentVersion],
      current_version: currentVersion
    };

    const validOldVersions = component.validOldFeesVersions(component.fee);
    expect(validOldVersions).toEqual([
      jasmine.objectContaining({ version: 1, flat_amount: jasmine.objectContaining({ amount: 300.00 }) })
    ]);
    expect(validOldVersions[0].flat_amount.amount).toBe(300.00);
  });

  it('Should not keep historical version when current version is older than six months', () => {
    const staleDate = new Date();
    staleDate.setMonth(staleDate.getMonth() - 7);
    const staleDateString = staleDate.toISOString();

    const oldVersion = {
      description: 'old', status: 'approved', version: 1,
      valid_from: '2019-01-01T00:00:00.000+0000', valid_to: staleDateString,
      flat_amount: { amount: 300.00 }
    };
    const currentVersion = {
      description: 'current', status: 'approved', version: 2,
      valid_from: staleDateString, valid_to: null, flat_amount: { amount: 526.00 }
    };

    component.fee = {
      code: 'FEE0219', fee_type: 'ranged',
      fee_versions: [oldVersion, currentVersion],
      current_version: currentVersion
    };

    const validOldVersions = component.validOldFeesVersions(component.fee);
    expect(validOldVersions).toEqual([]);
  });

  it('Should return true if current version is undefined (null valid_to)', () => {
    component.fee = {
      code: 'FEE0001', fee_type: 'banded',
      fee_versions: [
        { description: 'd1', status: 'approved', author: 'a1', approvedBy: 'b1', version: 1,
          valid_from: '2020-11-04T13:18:31.550+0000', valid_to: null,
          flat_amount: { amount: 0.50 }, memo_line: 'm1', statutory_instrument: '2014 No 874',
          si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced' }
      ]
    };
    component.validOldFeesVersions(component.fee);
    component.submitVolume();
    expect(component.fee.fee_versions.length).toBe(1);
    expect(component.fee.current_version).toBeUndefined();
    expect(component.validOldVersionArray.length).toBe(0);
  });

  it('Should handle two identical versions when current version is undefined', () => {
    const version = {
      description: 'd1', status: 'approved', author: 'a1', approvedBy: 'b1', version: 1,
      valid_from: '2020-11-04T13:18:31.550+0000', valid_to: null,
      flat_amount: { amount: 0.50 }, memo_line: 'm1', statutory_instrument: '2014 No 874',
      si_ref_id: '4.1a', natural_account_code: '4481102150', fee_order_name: 'Civil', direction: 'enhanced'
    };
    component.fee = { code: 'FEE0001', fee_type: 'banded', fee_versions: [version, { ...version }] };
    component.validOldFeesVersions(component.fee);
    component.submitVolume();
    expect(component.fee.fee_versions.length).toBe(2);
    expect(component.fee.current_version).toBeUndefined();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

});
