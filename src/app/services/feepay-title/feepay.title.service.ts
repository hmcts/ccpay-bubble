import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FeepayTitleService {
  private suffix = 'HM Courts & Tribunals Service - GOV.UK';
  private title;

  constructor(private titleService: Title) {}

  setTitleFromQueryParams(servicerequest: string, takePayment: string, view: string): void {
    let title: string;
    if (servicerequest == 'true') {
      title = 'Service Requests';
    } else if (takePayment == 'true') {
      title = 'Case Transactions';
    } else if (view === 'reports') {
      title = 'Reports';
    } else {
      title = 'Payment History';
    }
    this.setTitle(title);
  }

  setTitleFromPath(path) {
    let title = '';
    if (path === 'ccd-search') {
      title = 'Case Transactions';
    } else {
      title = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    this.setTitle(title);
  }
  setTitle(title: string){
    this.title = title;
    this.titleService.setTitle(`${title} - ${this.suffix}`);
  }
  getTitle(): string {
    return this.title;
  }
}
