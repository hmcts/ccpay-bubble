import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseBannerComponent } from './phase-banner.component';
import { By } from '@angular/platform-browser';

describe('PhaseBannerComponent', () => {
  let component: PhaseBannerComponent;
  let fixture: ComponentFixture<PhaseBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should default type property to beta', () => {
    expect(component.type).toBe('beta');
  });

  it('Should open new window', () => {
    spyOn(document, 'getElementById').and.returnValue(<any>{ value: 'test' });
    const url = spyOn( window, 'open' );
    component.myFunction();
    expect(document.getElementById).toHaveBeenCalled();
    expect(document.getElementById).toHaveBeenCalledWith('iFrameDrivenImageValue');
    expect(url).toHaveBeenCalledWith('https://www.smartsurvey.co.uk/s/PayBubble/?pageurl=test', '_blank');

  });
});
