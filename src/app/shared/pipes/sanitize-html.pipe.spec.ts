import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizeHtmlPipe, DomSanitizer]
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SanitizeHtmlPipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return safe HTML for a given string', () => {
    const result = pipe.transform('<b>bold</b>');
    expect(result).toBeTruthy();
  });

  it('should return safe HTML for an empty string', () => {
    const result = pipe.transform('');
    expect(result).toBeTruthy();
  });
});
