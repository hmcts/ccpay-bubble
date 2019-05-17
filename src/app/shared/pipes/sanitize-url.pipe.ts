import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeUrl' })
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: any): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
