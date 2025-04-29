import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynatraceService {
  private scriptAdded = false;
  private dynatraceScriptUrl = environment.dynatrace.scriptUrl;

  constructor() {}

  addDynatraceScript(): void {
    if (this.scriptAdded) {
      return;
    }

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';

      if (!this.dynatraceScriptUrl) {
        console.error('Dynatrace script URL is null or undefined.');
        return;
      }

      script.src = this.dynatraceScriptUrl;
      script.async = true;
      // Log the script element before appending it to the DOM
      console.log('Script attributes before appending:', {
        src: script.src,
        async: script.async,
        type: script.type,
      });
      document.head.appendChild(script);
      this.scriptAdded = true;
      console.log('Dynatrace script added successfully');
    } catch (error) {
      console.error('Failed to add Dynatrace script:', error);
    }
  }

  getBuildEnvironment(): string {
    return environment.envName; // Default to 'development' for now
  }
}
