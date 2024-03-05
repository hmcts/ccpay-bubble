import { Component, DebugElement, Input, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConstants } from '../../../app.constants';
import { Navigation } from '../footer/footer.model';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer.component';

describe('HmctsGlobalFooterComponent', () => {
    @Component({
      selector: 'exui-app-host-dummy-component',
      template: `<exui-app-hmcts-global-footer
                    [reference]="iconFallbackText"
                    [title]="type"
                    [items]="text"></exui-app-hmcts-global-footer>`
    })
  class TestDummyHostComponent {
        @Input() public navigation: Navigation;
        @ViewChild(HmctsGlobalFooterComponent, { static: false })
        public hmctsGlobalFooterComponent: HmctsGlobalFooterComponent;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testHostComponent = TestDummyHostComponent;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let el: DebugElement;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let de: any;
    let component: HmctsGlobalFooterComponent;
    let fixture: ComponentFixture<HmctsGlobalFooterComponent>;

    const navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;

    beforeEach(waitForAsync(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const rpxTranslationServiceStub = () => ({ language: 'en', translate: () => {} });

      TestBed.configureTestingModule({
        declarations: [HmctsGlobalFooterComponent],
        imports: [
          RouterTestingModule
        ],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HmctsGlobalFooterComponent);
      component = fixture.componentInstance;
      component.navigation = navigationData;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should be created by angular', () => {
      expect(fixture).not.toBeNull();
    });
});
