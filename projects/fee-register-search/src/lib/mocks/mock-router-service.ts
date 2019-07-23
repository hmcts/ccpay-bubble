export class MockRouterService {
  navigateByUrl = null;

  constructor() {
    this.navigateByUrl =  () => true;
  }
}
