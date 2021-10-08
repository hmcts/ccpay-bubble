import { ServiceFailureComponent } from 'src/app/shared/components/service-failure/service-failure.component';

let router: any;
let component: ServiceFailureComponent;

describe('Service failure component', () => {
  beforeEach(() => {
    router = { navigate: jasmine.createSpy('navigate')};
    component = new ServiceFailureComponent(router);
  });
});
