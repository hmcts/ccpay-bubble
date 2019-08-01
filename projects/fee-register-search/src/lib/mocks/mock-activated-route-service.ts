export class MockActivatedRouteService {
  snapshot = null;
  params = null;

  constructor() {
    this.params = {
      subscribe: (fun) => fun()
    };
    this.snapshot = {
      queryParams: {
        'ccdCaseNumber': '1234-1234-1234-1234'
      }
    };
  }
}
