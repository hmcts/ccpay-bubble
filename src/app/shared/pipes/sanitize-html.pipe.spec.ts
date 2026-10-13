import { SanitizeHtmlPipe } from './sanitize-html.pipe';

describe('SanitizeHtmlPipe', () => {
  let pipe: SanitizeHtmlPipe;
  let sanitizerSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);
    sanitizerSpy.bypassSecurityTrustHtml.and.callFake((value: string) => value);
    pipe = new SanitizeHtmlPipe(sanitizerSpy);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return safe HTML for a given string', () => {
    const result = pipe.transform('<b>bold</b>');
    expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith('<b>bold</b>');
    expect(result).toBe('<b>bold</b>');
  });

  it('should return safe HTML for an empty string', () => {
    const result = pipe.transform('');
    expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    expect(result).toBe('');
  });
});
