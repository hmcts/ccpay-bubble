import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  getCurrentEnvironment(): string {
    return environment.envName;
  }

  isProduction(): boolean {
    return environment.production;
  }
}
