import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private suffix = 'HM Courts & Tribunals Service - GOV.UK';
  private title;

  constructor(private titleService: Title) {}

  setTitle(title: string): void {
    this.title = title;
    this.titleService.setTitle(`${title} - ${this.suffix}`);
  }

  getTitle(): string {
    return this.title ;
  }
}
