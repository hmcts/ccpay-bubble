import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeUrl' })
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: any): SafeUrl {
    if (!url) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
