import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { AccessibilityStatementComponent } from './accessibility-statement.component';
import { Location } from '@angular/common';

describe('AccessibilityStatementComponent', () => {
  let component: AccessibilityStatementComponent;
  let fixture: ComponentFixture<AccessibilityStatementComponent>;
  let location: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessibilityStatementComponent],
      providers: [
        { provide: Location, useClass: SpyLocation }
      ]
    });
    fixture = TestBed.createComponent(AccessibilityStatementComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to previous page on header button click', () => {
    spyOn(location, 'back');
    component.backClicked();
    expect(location.back).toHaveBeenCalled();
  });
});
