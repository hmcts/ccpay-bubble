import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { DynatraceService } from './dynatrace.service';

describe('DynatraceService', () => {
  let service: DynatraceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynatraceService);
  });

  afterEach(() => {
    const script = document.querySelector('script[src="https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/e81e772d50fb5321_complete.js"]');
    if (script) {
      script.remove();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add the Dynatrace script to the DOM if not already added', fakeAsync(() => {
    service.addDynatraceScript();
    tick();

    const script = document.querySelector('script[src="https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/e81e772d50fb5321_complete.js"]');
    expect(script).toBeTruthy();
    expect(script?.hasAttribute('async')).toBeTrue();
  }));

  it('should not add the Dynatrace script if it is already added', fakeAsync(() => {
    service.addDynatraceScript();
    // Use fakeAsync to simulate the passage of time
        tick();
    service.addDynatraceScript(); // Call again to test idempotency
    // Use fakeAsync to simulate the passage of time
        tick();

    const scripts = document.querySelectorAll('script[src="https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/e81e772d50fb5321_complete.js"]');
    expect(scripts.length).toBe(1); // Ensure only one script is added
  }));

  it('should log an error if the Dynatrace script URL is null or undefined', fakeAsync(() => {
    spyOn(console, 'error');
    (service as any).dynatraceScriptUrl = null; // Simulate null URLwhy

    service.addDynatraceScript();
        tick();

    expect(console.error).toHaveBeenCalledWith('Dynatrace script URL is null or undefined.');
  }));

  it('should add the correct Dynatrace script based on the environment', fakeAsync(() => {
    const environments = {
      development: 'https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/e81e772d50fb5321_complete.js',
      production: 'https://js-cdn.dynatrace.com/jstag/17177a07246/bf24054dsx/e81e772d50fb5321_complete.js', //this will be different when production script has ben obtained
    };

    const getBuildEnvironmentSpy = spyOn(service as any, 'getBuildEnvironment');
    for (const [env, scriptUrl] of Object.entries(environments)) {
      console.log(`Testing environment: ${env}`); // Log the environment
      (service as any).dynatraceScriptUrl = scriptUrl;
      getBuildEnvironmentSpy.and.returnValue(env);

      service.addDynatraceScript();
      tick();

      const script = document.querySelector(`script[src="${scriptUrl}"]`);
      expect(script).toBeTruthy();
      expect(script?.hasAttribute('async')).toBeTrue();

      // Clean up for the next iteration
      script?.remove();
      (service as any).scriptAdded = false;
      (service as any).getBuildEnvironment.calls.reset();

    }
  }));

});
