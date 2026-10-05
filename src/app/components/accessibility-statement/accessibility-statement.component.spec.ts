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
        { provide: Location, useClass: SpyLocation },
        { provide: SpyLocation, useExisting: Location }
      ]
    });
    fixture = TestBed.createComponent(AccessibilityStatementComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(SpyLocation);
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

  it('should render the accessibility statement links with their destinations', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a.govuk-link') as NodeListOf<HTMLAnchorElement>
    );
    const destinations = links.map(link => link.getAttribute('href'));

    expect(destinations).toContain('https://paybubble.platform.hmcts.net');
    expect(destinations).toContain('mailto:DTS-FeePayServiceDesk@hmcts.net');
    expect(destinations).toContain('https://www.equalityadvisoryservice.com/');
    expect(destinations).toContain('https://www.w3.org/TR/WCAG21/');
    expect(destinations).toContain('https://www.w3.org/TR/WCAG22/');
  });
});
