import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from 'src/app/shared/pipes/sanitize-html.pipe';

describe('Sanitize Html Pipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('Should create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SanitizeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
