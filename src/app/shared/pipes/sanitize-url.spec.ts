import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';
import { SanitizeUrlPipe } from 'src/app/shared/pipes/sanitize-url.pipe';

describe('Sanitize Url Pipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        imports: [
          BrowserModule
        ]
      });
  });

  it('Should create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SanitizeUrlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
