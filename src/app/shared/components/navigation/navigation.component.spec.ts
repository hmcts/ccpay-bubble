import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { WindowUtil } from 'src/app/services/window-util/window-util';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      providers: [ WindowUtil ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display fee search when the url has .internal', () => {
    const windowUtil = TestBed.get(WindowUtil);
    windowUtil.setWindowHref('www.testwith.internal');
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).toContain('Fee Search');
  });

  it('should not display fee search when the url do not have .internal', () => {
    const windowUtil = TestBed.get(WindowUtil);
    windowUtil.setWindowHref('www.testwith.com');
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent).not.toContain('Fee Search');
  });
});
